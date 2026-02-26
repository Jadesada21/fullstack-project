import { pool } from '../db/connectPostgre.repository'
import { AppError } from '../util/AppError'

import {
    OrderResponse,
    CreateOrderInput,
    Status
} from '../types/order.type'

export const getAllOrderService = async () => {
    const sql = `select 
    id,
    user_id,
    order_number,
    total_price,
    earned_points,
    status,
    created_at,
    updated_at
    from orders 
    order by created_at desc`

    const response = await pool.query(sql)
    return response.rows
}

export const createOrderService = async (
    body: CreateOrderInput
): Promise<OrderResponse> => {

    const { user_id, items } = body
    const client = await pool.connect()

    try {
        await client.query("BEGIN")

        // ดึงข้อมูล product ทั้งหมดที่สั่ง
        const product_ids = [...new Set(items.map(i => i.product_id))]


        // lock row เพื่อกัน race condition
        const productResult = await client.query(`
            select id , price , reward_points , stock , is_active
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

        for (const [productId, totalQty] of quantityMap.entries()) {
            const product = productMap.get(productId)

            // check active + stock
            if (!product.is_active) {
                throw new AppError("Product is inactive", 400)
            }

            if (product.stock < totalQty) {
                throw new AppError("Instufficient stock", 400)
            }
        }

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
            [user_id, totalPrice, totalPoints]
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
                throw new AppError("Instufficient stock", 400)
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


        if (order.status === newStatus) {
            throw new AppError("Status already set", 400)
        }

        // อัพเดทสถานะได้ ก็ต่อเมื่อ สถานะ = pending
        if (order.status !== 'pending') {
            throw new AppError("Order already processed", 400)
        }

        // เปลี่ยนได้เฉพาะ 2 สถานะ
        if (!['completed', 'cancelled'].includes(newStatus)) {
            throw new AppError("Invalid status transition", 400)
        }

        if (user.role !== 'admin') {

            // ต้องเป็น order ของตัวเอง
            if (order.user_id !== user.id) {
                throw new AppError("Unauthorized", 403)
            }
        }

        await client.query(`
            update orders
            set status = $1,    
            updated_at = now()
            where id = $2
            `,
            [newStatus, orderId]
        )


        // Order ที่จบแล้ว update points
        if (newStatus === 'completed' && order.earned_points > 0) {
            await client.query(`
                insert into collect_point_history
                (user_id , order_id , points ,source )
                values($1,$2,$3,$4)
                returning *
                `,
                [order.user_id, orderId, order.earned_points, 'order']
            )

            await client.query(`
            update users
            set total_points = total_points + $1
            where id = $2
            `,
                [order.earned_points, order.user_id]
            )
        }

        if (newStatus === 'cancelled') {

            const items = await client.query(`
                select product_id , quantity from order_items where order_id = $1
                `,
                [orderId]
            )

            for (const item of items.rows) {
                await client.query(`
                update products
                set stock = stock + $1
                where id = $2   
                `,
                    [item.quantity, item.product_id]
                )
            }
        }

        await client.query("COMMIT")
        return { message: "Order updated Successfully" }
    } catch (err) {
        await client.query("ROLLBACK")
        throw err
    } finally {
        client.release()
    }
}

export const getOrderByidService = async (id: number) => {
    const response = await pool.query(
        `select * from orders where id = $1`,
        [id]
    )
    if (response.rowCount === 0) {
        throw new AppError("Orders not found", 404)
    }
    return response.rows[0]
}

export const getOrderByUserIdService = async (userId: number) => {
    const response = await pool.query(`
   select 
            o.id as order_id,
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
        left join order_items oi on oi.order_id = o.id
        left join products p on p.id = oi.product_id
        where o.user_id = $1
        group by o.id, o.status, o.total_price, o.created_at
        order by o.created_at desc
    `, [userId])

    return response.rows
}