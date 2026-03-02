import { pool } from '../db/connectPostgre.repository'
import { AppError } from '../util/AppError'



export const getAllStockmovementService = async () => {
    const response = await pool.query(`
        select * from stock_movement
        order by created_at desc
        `)
    return response.rows
}

export const getStockmovementByIdService = async (id: number) => {
    const response = await pool.query(`
        select * from stock_movement 
        where id = $1
        `, [id])

    if (response.rowCount === 0) {
        throw new AppError("Stock movement not found", 400)
    }
    return response.rows
}