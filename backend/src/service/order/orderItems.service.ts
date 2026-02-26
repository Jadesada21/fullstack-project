import { pool } from '../../db/connectPostgre.repository'
import { Role } from '../../types/users.type'
import { AppError } from '../../util/AppError'


export const getOrderItemByOrderIdService = async (orderId: number, userId: number, role: Role) => {
    let sql
    let values

    if (role === 'admin') {
        sql = `select 
        oi.id,
        oi.order_id,
        oi.product_id,
        p.name,
        oi.quantity,
        oi.price,
        oi.reward_points
        from order_item oi
        join products p on p.id = oi.product_id
        where oi.order_id = $1
        order by oi.id
        `
        values = [orderId]
    } else {
        sql = `select
        oi.id,
        oi.order_id,
        oi.product_id,
        p.name,
        oi.quantity,
        oi.price,
        oi.reward_points
        from order_item oi
        join orders o on o.id = oi.order_id
        join products p on p.id = op.product_id
        where oi.order_id = $1
        and o.user_id = $2
        order by oi.id
        `
        values = [orderId, userId]
    }

    const response = await pool.query(sql, values)

    if (response.rowCount === 0) {
        throw new AppError("Order items not found", 404)
    }

    return response.rows
}