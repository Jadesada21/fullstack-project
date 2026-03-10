import { pool } from '../../db/connectPostgre.repository'
import { AppError } from '../../util/AppError'

import {
    OrderResponse,
    CreateOrderInput,
    Status
} from '../../types/order.type'
import { Role } from '../../types/users.type'


//ad
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
             (user_id,  total_price, earned_points, status)
        values($1,$2,$3,'pending'
        )
        returning *`,
            [loginUserId, totalPrice, totalPoints]
        )

        const order = orderResult.rows[0]

        // insert order_items
        for (const [productId, totalQty] of quantityMap.entries()) {
            const product = productMap.get(productId)

            await client.query(`
                insert into order_items
                (order_id , product_id , quantity , price  , total_points)
                values($1,$2,$3,$4,$5)
                `,
                [
                    order.id,
                    productId,
                    totalQty,
                    product.price,
                    product.reward_points * totalQty
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


export const cancelOrderService = async (
    orderId: number,
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

        // cancelled order
        await client.query(`
                    update orders
                    set status = 'cancelled',
                        updated_at = now()
                        where id = $1
                    `, [orderId])

        await client.query("COMMIT")
        return { orderId }
    } catch (err) {
        await client.query("ROLLBACK")
        throw err
    } finally {
        client.release()
    }
}

//ad
export const getOrderByidService = async (orderId: number) => {
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


export const getAllOrderByLoginUserService = async (loginUserId: number) => {
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
                    'price_per_items', oi.price,
                    'total_points' , oi.total_points
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
        group by 
        o.id,
        o.order_number,
        o.status,
        o.total_price,
        o.earned_points,
        o.created_at
    order by o.created_at desc
    `, [loginUserId])

    return response.rows
}

export const getOrderByIdByLoginUserService = async (orderId: number, loginUserId: number) => {
    const response = await pool.query(`
        select 
            o.id as order_id,
            o.order_number,
            o.status,
            o.total_price,
            o.created_at,
        json_agg(
        json_build_object(
            'product_id', p.id,
            'product_name', p.name,
            'quantity', oi.quantity,
            'price', oi.price,
            'total_price', oi.quantity * oi.price
                 )
             ) as items
        from orders o
        join order_items oi on oi.order_id = o.id
        join products p on p.id = oi.product_id
        where o.id = $1
        and o.user_id = $2
        group by o.id
        `, [orderId, loginUserId])

    if (response.rowCount === 0) {
        throw new AppError("Orders not found", 404)
    }

    return response.rows[0]
}

export const createOrderFromCartService = async (
    loginUserId: number
): Promise<OrderResponse> => {
    const client = await pool.connect()

    try {
        await client.query("BEGIN")

        // ดึง cart items
        const cartResult = await client.query(`
            select 
                ci.product_id,
                ci.quantity
            from carts c
            join cart_items ci 
            on ci.cart.id = c.id
            where c.user_id = $1
            `, [loginUserId])

        const items = cartResult.rows

        if (items.length === 0) {
            throw new AppError("Cart is empty", 400)
        }

        const product_ids = [...new Set(items.map(i => i.product_id))]

        // lock product rows
        const productResult = await client.query(`
            select id , price , name , reward_points , stock , is_active
            from products
            where id = any($1)
            `, [product_ids])

        const productMap = new Map(
            productResult.rows.map(p => [p.id, p])
        )

        let totalPrice = 0
        let totalPoints = 0

        for (const item of items) {
            const product = productMap.get(item.product_id)

            if (!product.is_active) {
                throw new AppError("Product inactive", 400)
            }

            if (product.stock < item.quantity) {
                throw new AppError("insufficient stock", 400)
            }

            totalPrice += product.price * item.quantity
            totalPoints += product.reward_points * item.quantity
        }

        // create order

        const orderResult = await client.query(`
            insert into orders
            (user_id ,total_price , earned_points , status)
            values($1,$2,$3,'pending')
            returning *
            `, [loginUserId, totalPrice, totalPoints])

        const order = orderResult.rows[0]

        // create order items
        for (const item of items) {

            const product = productMap.get(item.product_id)

            await client.query(`
                insert into order_items
                (order_id , product_id , quantity, price , total_points)
                values($1,$2,$3,$4)
                `, [
                order.id,
                item.product_id,
                item.quantity,
                product.price,
                product.reward_points * item.quantity
            ])
        }

        // clear cart
        await client.query(`
            delete from cart_items
            where card_id = (
                select id from carts where user_id = $1
            )
            `, [loginUserId])

        await client.query("COMMIT")

        return order
    } catch (err) {
        await client.query("ROLLBACK")
        throw err
    } finally {
        client.release()
    }
}