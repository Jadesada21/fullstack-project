import { pool } from '../../db/connectPostgre.repository'
import { Role } from '../../types/users.type'
import { AppError } from '../../util/AppError'


export const getRedeemItemByUserIdService = async (redeemId: number, userId: number, role: Role) => {
    let sql
    let values

    if (role === 'admin') {
        sql = `select 
        ri.id,
        ri.redeem_id,
        ri.reward_id,
        r.name,
        ri.quantity,
        ri.points_per_item,
        ri.total_points_used
        from redeem_items ri
        join rewards r on r.id = ri.reward_id
        where ri.redeem_id = $1
        redeem by ri.id
        `
        values = [redeemId]
    } else {
        sql = `select
        ri.id,
        ri.redeem_id,
        ri.reward_id,
        r.name,
        ri.quantity,
        ri.points_per_item,
        ri.total_points_used
        from redeem_items ri
        join redeems rd on rd.id = ri.redeem_id
        join rewards r on r.id = ri.reward_id
        where ri.redeem_id = $1
        and rd.user_id = $2
        order by ri.id
        `
        values = [redeemId, userId]
    }

    const response = await pool.query(sql, values)

    if (response.rowCount === 0) {
        throw new AppError("Redeem items not found", 404)
    }

    return response.rows
}