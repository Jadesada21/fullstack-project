import { pool } from '../../db/connectPostgre.repository'
import { AppError } from '../../util/AppError'

import {
    PromoCodeTypeResponse,
    PromoCodeTypeInput
} from '../../types/promo.type'


export const getAllPromoCodeService = async () => {
    const response = await pool.query(`
        select * from promo_code order by created_at desc
        `)

    return response.rows
}

export const createPromoCodeService = async (body: PromoCodeTypeInput): Promise<PromoCodeTypeResponse> => {

    const { code, points, max_usage } = body

    const normalizedCode = code.trim().toUpperCase()

    try {
        const response = await pool.query(`
        insert into promo_code 
        (code , points , max_usage)
        values($1,$2,$3)
        returning *
        `, [normalizedCode, points, max_usage])

        return response.rows[0]
    } catch (err: any) {
        if (err.code === '23505') {
            throw new AppError("Promo code already exists", 400)
        }
        throw err
    }
}

export const getPromoCodeByIdService = async (id: number) => {
    const response = await pool.query(`
        select * from promo_code where id = $1
        `, [id])

    if (response.rowCount === 0) {
        throw new AppError("Promo code not found ", 404)
    }
    return response.rows[0]
}

export const togglePromoCodeActiveService = async (id: number) => {
    const response = await pool.query(`
        update promo_code
        set is_active = not is_active
        where id = $1
        returning *
        `, [id])

    if (response.rowCount === 0) {
        throw new AppError("Promo code not found", 400)
    }

    return response.rows[0]
}