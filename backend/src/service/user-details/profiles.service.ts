import { pool } from "../../db/connectPostgre.repository"
import { AppError } from "../../util/AppError"

export const getProfileByLoginUserService = async (userId: number) => {
    const respnose = await pool.query(`
        select  
            username ,
            email ,
            first_name , 
            last_name , 
            phone_num ,
            points 
        from users 
        where id = $1
        `, [userId])

    if (respnose.rowCount === 0) {
        throw new AppError("User not found", 404)
    }
    return respnose.rows[0]
}

export const getAllPaymentByLoginUserService = async (userId: number) => {
    const response = await pool.query(`
        select
            p.order_id,
            p.amount,
            p.transaction_ref,
            p.created_at,
            p.payment_provider,
            p.paid_at,
            p.status
        from payment p
        join orders o on p.order_id = o.id
        where o.user_id = $1
        order by p.created_at desc
        `, [userId])

    return response.rows
}

export const getAllRedeemByLoginUserService = async (userId: number) => {
    const response = await pool.query(`
        select 
            id,
            name,
            points_required,
            created_at,
            earned_points,
            updated_at,
            status
        from orders
        where user_id = $1
        `, [userId])

    return response.rows
}