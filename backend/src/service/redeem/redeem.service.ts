import { pool } from '../../db/connectPostgre.repository'
import { AppError } from '../../util/AppError'

import {
    RedeemResponse,
    CreateRedeemInput,
    RedeemUpdateStatus
} from '../../types/redeem.type'

export const getAllRedeemService = async () => {
    const response = await pool.query(`
        select * from redeems
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

        // limit 1 redeem <= 2 items
        const maxRedeemItems = 2

        const totalQty = items.reduce((sum, item) => sum + item.quantity, 0)

        if (totalQty > maxRedeemItems) {
            throw new AppError("Redeem limit exceeded (max 2 items)", 400)
        }

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
        let totalPointsUsed = 0


        for (const [rewardId, totalQty] of quantityMap.entries()) {

            const reward = rewardMap.get(rewardId)!

            if (!reward.is_active) {
                throw new AppError(`Reward ${rewardId} Inactive`, 400)
            }

            if (reward.stock < totalQty) {
                throw new AppError("Insufficient stock", 400)
            }

            totalPointsUsed += reward.points_required * totalQty
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

        if (user.points < totalPointsUsed) {
            throw new AppError("Insufficient points", 400)
        }


        // สร้าง redeem
        const redeemResult = await client.query(`
            insert into redeems
            (user_id  , total_points_used , status)
            values($1,$2,'pending')
            returning *`,
            [loginUserId, totalPointsUsed]
        )
        const redeem = redeemResult.rows[0]

        for (const item of items) {

            const reward = rewardMap.get(item.reward_id)

            if (!reward) {
                throw new AppError("Reward not found", 400)
            }

            const totalPoints = item.quantity * reward.points_required

            await client.query(`
                insert into redeem_items
                (redeem_id , reward_id , quantity , points_per_item , total_points_used)
                values($1,$2,$3,$4,$5)
                `, [
                redeem.id,
                item.reward_id,
                item.quantity,
                reward.points_required,
                totalPoints
            ])
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
    newStatus: RedeemUpdateStatus,
    loginUserId: number, role: string
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
        if (role !== 'admin' && Number(redeem.user_id) !== loginUserId) {
            throw new AppError("Forbidden", 403)
        }

        if (redeem.status !== 'pending') {
            throw new AppError("Order already processed", 400)
        }

        if (!['completed', 'failed'].includes(newStatus)) {
            throw new AppError("Invalid status transition", 400)
        }

        if (redeem.status === newStatus) {
            throw new AppError("Status already set", 400)
        }

        const itemsResult = await client.query(`
            select reward_id , quantity , points_per_item
            from redeem_items
            where redeem_id = $1
            `, [redeemId]
        )

        const items = itemsResult.rows

        // confirm
        if (newStatus === 'completed') {

            // lock row user 
            const userResult = await client.query(`
                select id , points
                from users
                where id = $1
                for update
                `, [redeem.user_id])

            const userData = userResult.rows[0]

            if (userData.points < redeem.total_points_used) {
                throw new AppError("Insufficient points", 400)
            }

            // decrease points
            await client.query(`
                update users
                set points = points - $1
                where id = $2
                `, [redeem.total_points_used, redeem.user_id])

            await client.query(`
                insert into point_histories
                (user_id , points , source , reference_type , reference_id)
                values ($1,$2,  'redeem_use' , 'redeem' ,$3)
                `, [redeem.user_id, -redeem.total_points_used, redeem.id])


            for (const item of items) {
                // decrease reward stock
                const result = await client.query(`
                    update rewards
                    set stock = stock - $1
                    where id = $2
                    and stock >= $1
                    returning id
                    `, [item.quantity, item.reward_id])

                if (result.rowCount === 0) {
                    throw new AppError("insufficient stock", 400)
                }

                await client.query(`
                insert into stock_movements
                (item_type , item_id , quantity , movement_type , reference_type , reference_id)
                values ('reward' ,$1 , $2 ,'redeem','redeem' ,$3)
                `, [item.reward_id, -item.quantity, redeem.id])
            }

            await client.query(`
                update redeems
                set status = 'completed',
                updated_at = now()
                where id = $1
                `, [redeemId])
        }

        // cancelled
        if (newStatus === 'failed') {

            await client.query(`
                update redeems
                set status = 'cancelled'
                where id = $1
                `, [redeemId])
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


export const getAllRedeemsByLoginUserService = async (loginUserId: number) => {

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
                    'reward_id', rw.id,
                    'name', rw.name,
                    'quantity', ri.quantity,
                    'points_per_item', ri.points_per_item,
                    'total_points_used', ri.total_points_used
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

        group by
            r.id,
            r.redeem_number,
            r.status,
            r.total_points_used,
            r.created_at

        order by r.created_at desc
    `, [loginUserId])

    return response.rows
}

export const getRedeemByIdByLoginUserService = async (
    redeemId: number,
    loginUserId: number
) => {

    const response = await pool.query(`
        select 
            r.id as redeem_id,
            r.redeem_number,
            r.status,
            r.total_points_used,
            r.created_at,

        json_agg(
            json_build_object(
                'reward_id', rw.id,
                'reward_name', rw.name,
                'image_url', riw.image_url,
                'quantity', ri.quantity,
                'points_per_item', ri.points_per_item,
                'total_points_used', ri.total_points_used
            )
        ) as items

        from redeems r

        join redeem_items ri
            on ri.redeem_id = r.id

        join rewards rw
            on rw.id = ri.reward_id

        left join reward_images riw
            on riw.reward_id = rw.id
            and riw.is_primary = true

        where r.id = $1
        and r.user_id = $2

        group by
            r.id,
            r.redeem_number,
            r.status,
            r.total_points_used,
            r.created_at
    `, [redeemId, loginUserId])

    if (response.rowCount === 0) {
        throw new AppError("Redeem not found", 404)
    }

    return response.rows[0]
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