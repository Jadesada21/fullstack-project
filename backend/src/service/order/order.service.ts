import { pool } from '../../db/connectPostgre.repository'
import { AppError } from '../../util/AppError'

import {
    OrderResponse,
    CreateOrderInput,
    Status
} from '../../types/order.type'
import { Role } from '../../types/users.type'



export const getAllOrderService = async () => {
    const sql = `select 
    *
    from orders 
    order by created_at desc`

    const response = await pool.query(sql)
    return response.rows
}


export const createOrderService = async (
    body: CreateOrderInput,
    loginUserId: number
): Promise<OrderResponse> => {

    const { items } = body
    const client = await pool.connect()

    try {
        await client.query("BEGIN")

        // ดึงข้อมูล product ทั้งหมดที่สั่ง
        const product_ids = [...new Set(items.map(i => i.product_id))]


        // lock row เพื่อกัน race condition
        const productResult = await client.query(`
            select id , price , name,  reward_points , stock , is_active
            from products   
            where id = any($1)    
            for update
            `,
            [product_ids]
        )

        if (productResult.rows.length !== product_ids.length) {
            throw new AppError("Some products not found", 400)
        }

        // map product ไว้ใช้งาน
        const productMap = new Map(
            productResult.rows.map(p => [p.id, p])
        )

        let totalPrice = 0
        let totalPoints = 0

        // รวม quantity (กัน duplicate)
        const quantityMap = new Map<number, number>()
        for (const item of items) {
            quantityMap.set(
                item.product_id,
                (quantityMap.get(item.product_id) || 0) + item.quantity
            )
        }

        // check active + stock
        for (const [productId, totalQty] of quantityMap.entries()) {

            const product = productMap.get(productId)

            if (!product.is_active) {
                throw new AppError("Product is inactive", 400)
            }

            if (product.stock < totalQty) {
                throw new AppError("Insufficient stock", 400)
            }
        }

        // calculate totals
        for (const item of items) {
            const product = productMap.get(item.product_id)

            totalPrice += product.price * item.quantity
            totalPoints += product.reward_points * item.quantity
        }

        // สร้าง Order
        const orderResult = await client.query(`
            insert into orders
             (user_id, order_number, total_price, earned_points, status)
        values($1,
        'ORD-' || lpad(nextval('order_number_seq')::text, 6 , '0'),
        $2,
        $3,
        'pending'
        )
        returning *`,
            [loginUserId, totalPrice, totalPoints]
        )

        const order = orderResult.rows[0]

        // double check stock
        for (const [productId, totalQty] of quantityMap.entries()) {

            const result = await client.query(`
                update products
                set stock = stock - $1
                where id = $2
                and stock >= $1
                returning id
                `,
                [totalQty, productId]
            )

            if (result.rowCount === 0) {
                throw new AppError("Insufficient stock", 400)
            }
        }

        // insert order_items
        for (const item of items) {
            const product = productMap.get(item.product_id)

            await client.query(`
                insert into order_items
                (order_id , product_id , quantity , price  , reward_points)
                values($1,$2,$3,$4,$5)
                `,
                [
                    order.id,
                    item.product_id,
                    item.quantity,
                    product.price,
                    product.reward_points
                ]
            )
        }

        await client.query("COMMIT")

        return order

    } catch (err) {
        await client.query("ROLLBACK")
        throw err
    } finally {
        client.release()
    }
}


export const updateStatusOrderService = async (
    orderId: number,
    newStatus: Status,
    user: any
) => {

    const client = await pool.connect()

    try {
        await client.query("BEGIN")

        // lock order
        const orderResult = await client.query(`
            select * from orders where id = $1
            for update
            `,
            [orderId]
        )

        if (orderResult.rowCount === 0) {
            throw new AppError("Order not found", 400)
        }

        const order = orderResult.rows[0]

        // ต้องเป็น order ของตัวเอง
        if (user.role !== 'admin' && order.user_id !== user.id) {
            throw new AppError("Forbidden", 403)
        }

        // อัพเดทสถานะได้ ก็ต่อเมื่อ สถานะ = pending
        if (order.status !== 'pending') {
            throw new AppError("Order already processed", 400)
        }

        // เปลี่ยนได้เฉพาะ 2 สถานะ
        if (!['completed', 'cancelled'].includes(newStatus)) {
            throw new AppError("Invalid status transition", 400)
        }

        if (order.status === newStatus) {
            throw new AppError("Status already set", 400)
        }

        const itemsResult = await client.query(`
            select product_id , quantity
            from order_items
            where order_id = $1
            `, [orderId]
        )

        const items = itemsResult.rows


        // Order ที่จบแล้ว update points
        if (newStatus === 'completed') {

            for (const item of items) {

                const productResult = await client.query(`
                    select stock
                    from products
                    where id =$1
                    for update
                    `, [item.product_id])

                const product = productResult.rows[0]

                if (product.stock < item.quantity) {
                    throw new AppError("Insufficient stock ", 400)
                }

                // decrease stock
                await client.query(`
                    update products
                    set stock = stock - $1
                    where id =$ 2
                    `, [item.quantity, item.product_id])


                // stock movement out
                await client.query(`
                        insert into stock_movements
                        (
                        item_type,
                        item_id,
                        quantity,
                        movement_type,
                        reference_type,
                        reference_id
                        )
                        values($1,$2,'order','order',$3)
                        `, [item.product_id, -item.quantity, orderId])
            }

            // get points
            if (order.earned_points > 0) {
                await client.query(`
                      insert into point_histories
                (user_id , points ,source , reference_type , reference_id )
                values($1,$2,'order','order',$3)
                returning *
                `,
                    [order.user_id, order.earned_points, orderId]
                )

                await client.query(`
                    update users
                    set total_points = total_points + $1
                    where id = $2
            `,
                    [order.earned_points, order.user_id]
                )
            }
        }

        if (newStatus === 'cancelled') {

            for (const item of items) {

                // restore stock
                await client.query(`
                    update products
                    set stock = stock + $1
                    where id =$2
                    `, [item.quantity, item.product_id])


                // stock movement return
                await client.query(`
               insert into stock_movements
               (item_type, item_id,quantity,movement_type , reference_type , reference_id)
               values('product' , $1 , $2 ,'cancel' , 'order' , $3)
                `,
                    [item.product_id, item.quantity, orderId]
                )
            }

            // update order (list)

            await client.query(`
                    update orders
                    set status = $1,
                        updated_at = now()
                        where id = $2
                    `, [newStatus, orderId])
        }
        await client.query("COMMIT")
        return { orderId: orderId, status: newStatus }
    } catch (err) {
        await client.query("ROLLBACK")
        throw err
    } finally {
        client.release()
    }
}


export const getOrderByidService = async (orderId: number, loginUserId: number, role: Role) => {
    const response = await pool.query(
        `select * 
        from orders 
        where id = $1 
        `,
        [orderId]
    )

    if (response.rowCount === 0) {
        throw new AppError("Orders not found", 404)
    }

    return response.rows[0]
}


export const getOrderByUserIdService = async (loginUserId: number) => {
    const response = await pool.query(`
   select 
            o.id as order_id,
            o.order_number,
            o.status,
            o.total_price,
            o.created_at,
        coalesce(
            json_agg(
                json_build_object(
                    'product_id', p.id,
                    'name', p.name,
                    'quantity', oi.quantity,
                    'price', oi.price
                )
            ) filter (where oi.id is not null),
             '[]'
        ) as items
        from orders o 
        left join order_items oi 
                on oi.order_id = o.id
        left join products p 
                on p.id = oi.product_id
        where o.user_id = $1
        group by o.id
        order by o.created_at desc
    `, [loginUserId])

    return response.rows
}