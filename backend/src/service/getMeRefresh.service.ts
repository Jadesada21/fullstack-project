import { pool } from "../db/connectPostgre.repository"
import { AppError } from "../util/AppError"

export const getMeRefreshService = async (userId: number) => {
    const result = await pool.query(`
        select  id , username  , role 
        from users
        where id = $1
        `, [userId])

    if (result.rowCount === 0) {
        throw new AppError("User not found", 404)
    }

    return result.rows[0]
}