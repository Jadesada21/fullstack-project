import { pool } from '../db/connectPostgre.repository'
import { Role } from '../types/users.type'
import { AppError } from '../util/AppError'


export const getAllPaymentService = async () => {
    const response = await pool.query(`
        select 
        id,
        order_id,
        amount,
        status,
        transaction_ref,
        created_at,
        paid_at,
        payment_provider
        from payment 
        order by created_at desc
        `)
    return response.rows
}

export const createPaymentService = async (order_id: number, userId: number) => {

    const client = await pool.connect()

    try {
        await client.query("BEGIN")

        // get order
        const orderResult = await client.query(`
            select 
            id,
            total_price ,
            status 
            from orders
            where id = $1 
            and user_id = $2
            for update
            `, [order_id, userId]
        )

        if (orderResult.rowCount === 0) {
            throw new AppError("Order not found", 400)
        }

        const order = orderResult.rows[0]

        if (order.status !== 'pending') {
            throw new AppError("Order already process", 400)
        }

        // gen transaction_ref
        const transaction_ref = `MOCK-${Date.now()}-${order_id}`

        // ตรวจสอบว่ามี pending payment ของ order นี้อยู่แล้วหรือไม่ (กันสร้าง payment ซ้ำ)
        const existingPayment = await client.query(`
            select id
            from payment 
            where order_id = $1
            and status = 'pending'
            for update
            `, [order_id]
        )

        const existingCount = existingPayment.rowCount ?? 0

        if (existingCount > 0) {
            throw new AppError("Pending payment already exists", 400)
        }

        // create payment
        const paymentResult = await client.query(`
            insert into payment
           (order_id , amount , transaction_ref ,status ,payment_provider)
            values($1,$2,$3,'pending','mock')
            returning *
            `,
            [order_id, order.total_price, transaction_ref]
        )

        await client.query("COMMIT")
        return paymentResult.rows[0]
    } catch (err) {
        await client.query("ROLLBACK")
        throw err
    } finally {
        client.release()
    }

}

export const comfirmPaymentService = async (paymentId: number, loginUserId: number) => {

    const client = await pool.connect()
    try {
        await client.query("BEGIN")

        // lock payment
        const paymentResult = await client.query(`
            select p.order_id , p.status , o.user_id
            from payment p 
            join orders o on o.id = p.order_id
            where p.id = $1
            for update of p , o 
            `, [paymentId])

        if (paymentResult.rowCount === 0) {
            throw new AppError("Payment not found", 400)
        }

        const payment = paymentResult.rows[0]

        if (payment.user_id !== loginUserId) {
            throw new AppError("Forbidden", 403)
        }

        if (payment.status !== 'pending') {
            throw new AppError("Payment already processed", 400)
        }

        // update payment
        await client.query(`
            update payment
            set status = 'paid',
            paid_at = now()
            where id = $1
            `, [paymentId])

        // update order
        await client.query(`
            update orders
            set status = 'completed'
            where id = $1
            `,
            [payment.order_id])

        await client.query("COMMIT")
        return {
            payment_id: paymentId,
            order_id: payment.order_id,
            status: 'paid'
        }
    } catch (err) {
        await client.query("ROLLBACK")
        throw err
    } finally {
        client.release()
    }
}

export const cancelledPaymentService = async (paymentId: number, loginUserId: number) => {
    const client = await pool.connect()

    try {
        await client.query("BEGIN")

        // lock payment + order 
        const paymentResult = await client.query(`
            select 
                p.order_id,
                p.status,
                o.user_id,
            from payment p
            join orders o on o.id = p.order_id
            where p.id = $1
            for update of p , o
            `[paymentId])

        if (paymentResult.rowCount === 0) {
            throw new AppError("Payment not found", 400)
        }

        const payment = paymentResult.rows[0]

        // owner check
        if (payment.user_id !== loginUserId) {
            throw new AppError("Forbidden", 403)
        }

        // allow cancel only pending
        if (payment.status !== 'pending') {
            throw new AppError("Payment already processed", 400)
        }

        // cancel payment
        await client.query(`
            update orders
            set status = 'cancelled',
            updated_at = now()
            where id = $1
            and status = 'pending'
            `[payment.order_id])


        // cancel order
        const items = await client.query(`
            select product_id , quantity
            from order_items
            where order_id = $1
            `, [payment.order_id])

        // restore stock
        for (const item of items.rows) {
            await client.query(`
                update products
                set stock = stock + $1
                where id =$2
                `, [item.quantity, item.product_id])
        }

        await client.query("COMMIT")
    } catch (err) {
        await client.query("ROLLBACK")
    } finally {
        client.release()
    }
}

export const getPaymentByIdService = async (
    paymentId: number,
    loginUserId: number,
    role: Role
) => {

    const response = await pool.query(
        role === 'admin'
            ? `
        select 
            p. * ,
            o.user_id
        from payment p 
        join orders o on o.id = p.order_id
        where p.id = $1
        `
            :
            `
        select p.* , o.user_id
        from payment p 
        join orders o on o.id = p.order_id
        where p.id = $1
        and o.user_id = $2
        `,
        role === 'admin'
            ? [paymentId]
            : [paymentId, loginUserId]
    )

    if (response.rowCount === 0) {
        throw new AppError("Payment not found", 400)
    }

    const payment = response.rows[0]

    return payment
}