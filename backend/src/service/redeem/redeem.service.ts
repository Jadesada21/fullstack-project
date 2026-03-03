import { pool } from '../../db/connectPostgre.repository'
import { Role } from '../../types/users.type'
import { AppError } from '../../util/AppError'

import {
    RedeemResponse,
    CreateRedeemInput,
    Status
} from '../../types/redeem.type'

export const getAllRedeemService = async () => {
    const response = await pool.query(`
        select * from redeem_history
        order by created_at desc
        `)

    return response.rows
}

export const createRedeemService = async (
    body: CreateRedeemInput,
    loginUserId: number
): Promise<RedeemResponse> => {

    const { items } = body
    const client = await pool.connect()

    try {
        await client.query("BEGIN")

        // ดึงข้อมูล reward ทั้งหมดที่เลือก 
        const reward_ids = [...new Set(items.map(i => i.reward_id))]


        // lock row เพื่อกัน race conidtion
        const rewardResult = await client.query(`
            select id , name , points_required , stock , is_active
            from rewards
            where id = any($1)
            for update
            `, [reward_ids])

        if (rewardResult.rows.length !== reward_ids.length) {
            throw new AppError("Some rewards not found", 400)
        }

        // merge quantity
        const rewardMap = new Map(
            rewardResult.rows.map(r => [r.id, r])
        )

        const quantityMap = new Map<number, number>()
        for (const item of items) {
            quantityMap.set(
                item.reward_id,
                (quantityMap.get(item.reward_id) || 0) + item.quantity
            )
        }


        // validate reward
        let totalPoints_used = 0

        for (const [rewardId, totalQty] of quantityMap.entries()) {

            const reward = rewardMap.get(rewardId)!

            if (!reward.is_active) {
                throw new AppError(`Reward ${rewardId} Inactive`, 400)
            }

            if (reward.stock < totalQty) {
                throw new AppError("Insufficient stock", 400)
            }

            totalPoints_used += reward.points_required * totalQty

        }

        // calculate totals
        for (const item of items) {
            const reward = rewardMap.get(item.reward_id)

        }

        // lock user
        const userResult = await client.query(`
            select id , points 
            from users 
            where id = $1
            for update
            `, [loginUserId])

        const user = userResult.rows[0]

        if (!user) {
            throw new AppError("User not found", 404)
        }

        if (user.points < totalPoints_used) {
            throw new AppError("Insufficient points", 400)
        }


        // สร้าง redeem
        const redeemResult = await client.query(`
            insert into redeems
            (user_id , redeem_number , total_points_used , status)
            values($1,
            'RDM-' || lpad(nextval('redeem_number_seq'):: text, 6 , '0'),
            $2,
            'pending'
            )
            returning *`,
            [loginUserId, totalPoints_used]
        )
        const redeem = redeemResult.rows[0]


        // decrease user point
        const userUpdate = await client.query(`
                update users
                set points = points - $1
                where id = $2
                and points >= $1
                returning id
                `, [totalPoints_used, loginUserId]
        )

        if (userUpdate.rowCount === 0) {
            throw new AppError("Point decrease failed", 400)
        }

        // points_movement
        await client.query(`
            insert into points_histories(
            user_id,
            points,
            source,
            reference_type,
            reference_id)
            values ($1,$2,'redeem','redeem' ,$3)
            `, [loginUserId, -totalPoints_used, redeem.id])


        // decrease reward stock
        for (const [rewardId, totalQty] of quantityMap.entries()) {

            const result = await client.query(`
                update rewards
                set stock = stock - $1
                where id = $2
                and stock >= $1
                returning id
                `,
                [totalQty, rewardId]
            )

            if (result.rowCount === 0) {
                throw new AppError("Stock update failed", 400)
            }

            await client.query(`
            insert into stock_movements(
            item_type,
            item_id,
            quantity,
            movement_type,
            reference_type,
            reference_id)
            values($1,$2,$3,$4,$5,$6)
            `, ['reward',
                rewardId,
                -totalQty,
                'redeem',
                'redeem',
                redeem.id])
        }


        // insert redeem_item
        for (const item of items) {

            const reward = rewardMap.get(item.reward_id)

            if (!reward) {
                throw new AppError("Reward not found ", 400)
            }

            const totalPoints = item.quantity * reward.points_required

            await client.query(`
                insert into redeem_items
                (redeem_id , reward_id , quantity , points_per_item , total_points_used)
                values($1,$2,$3,$4,$5)
                `,
                [
                    redeem.id,
                    item.reward_id,
                    item.quantity,
                    reward.points_required,
                    totalPoints
                ]
            )
        }
        await client.query("COMMIT")

        return redeem
    } catch (err) {
        await client.query("ROLLBACK")
        throw err
    } finally {
        client.release()
    }
}

export const updateStatusRedeemService = async (
    redeemId: number,
    newStatus: Status,
    user: any
) => {
    const client = await pool.connect()

    try {
        await client.query("BEGIN")

        // lock redeem
        const redeemResult = await client.query(`
            select * from redeems where id = $1
            for update
            `, [redeemId]
        )

        if (redeemResult.rowCount === 0) {
            throw new AppError("Redeem not found ", 400)
        }

        const redeem = redeemResult.rows[0]

        // check own
        if (user.role !== 'admin' && redeem.user_id !== user.id) {
            throw new AppError("Forbidden", 403)
        }

        if (redeem.status !== 'pending') {
            throw new AppError("Order already processed", 400)
        }

        if (!['completed', 'cancelled'].includes(newStatus)) {
            throw new AppError("Invalid status transition", 400)
        }

        if (redeem.status === newStatus) {
            throw new AppError("Status already set", 400)
        }


        const itemsResult = await client.query(`
            select reward_id , quantity
            from redeem_items
            where redeem_id = $1
            `, [redeemId]
        )

        const items = itemsResult.rows

        // confirm
        if (newStatus === 'confirm') {
            await client.query(`
                    update redeems
                    set status = $1,
                    updated_at = now()
                    where id = $2
                    `, ['confirm', redeemId])
        }

        // cancelled
        if (newStatus === 'cancelled') {

            for (const item of items) {

                await client.query(`
                    update rewards
                    set stock = stock + $1
                    where id = $2
                    `, [item.quantity, item.reward_id])

                // restore stock
                await client.query(`
                        insert into stock_movements
                        (
                        item_type ,
                        item_id,
                        quantity,
                        movement_type,
                        reference_type,
                        reference_id
                        )
                        values('reward', $1,$2 ,'cancel', 'redeem', $3)
                        `, [item.reward_id, item.quantity, redeemId])
            }

            // restore points
            await client.query(`
                update users 
                set points = points + $1
                where id = $2
                `, [redeem.total_points_used, redeem.user_id])


            await client.query(`
                insert into points_histories
                (user_id , points, source, reference_type , reference_id)
                values($1, $2 , 'redeem_cancel' ,'redeem',$3)
                `, [redeem.user_id, redeem.total_points_used, redeemId])


            // update status
            await client.query(`
                    update redeems
                    set status = $1,
                    updated_at = now()
                    where id = $2
                    `, [newStatus, redeemId])
        }

        await client.query("COMMIT")

        return {
            redeemId,
            status: newStatus
        }


    } catch (err) {
        await client.query("ROLLBACK")
        throw err
    } finally {
        client.release()
    }
}

export const getRedeemByIdService = async (
    redeemId: number,
    loginUserId: number
) => {
    const response = await pool.query(
        `select * 
        from redeems
        where id = $1
        and user_id = $2
        `, [redeemId, loginUserId]
    )

    if (response.rowCount === 0) {
        throw new AppError("Redeem not found", 404)
    }

    return response.rows[0]
}

export const getRedeemByUserIdService = async (
    loginUserId: number
) => {
    const response = await pool.query(`
        select 
            r.id as redeem_id,
            r.redeem_number,
            r.status,
            r.total_points_used,
            r.created_at,
        coalesce(
            json_agg(
                json_build_object(
                    'reward_id' , rw.id,
                    'name' , rw.name,
                    'quantity' , ri.quantity,
                    'points_per_item' , ri.points_per_item
                    )
                ) filter (where ri.id is not null),
                '[]' 
            ) as items
            from redeems r
            left join redeem_items ri
                    on ri.redeem_id = r.id
            left join rewards rw
                    on rw.id = ri.reward_id
            where r.user_id = $1
            group by r.id
            order by o.created_at desc
        `, [loginUserId])

    return response.rows
}

export const adminGetRedeemByIdService = async (
    redeemId: number
) => {
    const response = await pool.query(`
        select * from redeems
        where id = $1
        `, [redeemId])
    if (response.rowCount === 0) {
        throw new AppError("Redeem not found", 404)
    }

    return response.rows[0]
}