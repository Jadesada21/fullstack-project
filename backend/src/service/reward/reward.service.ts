import { pool } from '../../db/connectPostgre.repository'
import { AppError } from '../../util/AppError'

import {
    RewardResponse,
    CreateRewardInput
} from '../../types/reward.type'

export const getAllRewardService = async () => {
    const sql = ` select 
        id,
        name,
        description,
        short_description,
        points_required,
        stock,
        category_id,
        is_active,
        created_at,
        updated_at
        from rewards
        `
    const response = await pool.query(sql)
    return response.rows
}


export const createRewardService = async (
    body: CreateRewardInput
): Promise<RewardResponse> => {

    const { name, description, short_description, stock, points_required, category_id } = body

    const response = await pool.query(`
        insert into rewards 
        (name , description ,short_description, stock , points_required , category_id)
        values ($1,$2,$3,$4,$5,$6)
        returning *
        `,
        [name, description, short_description, stock, points_required, category_id]
    )
    return response.rows[0]
}


export const getRewardByIdService = async (id: number) => {
    const response = await pool.query(
        `select * from rewards where id = $1`,
        [id]
    )
    if (response.rowCount === 0) {
        throw new AppError("reward not found", 404)
    }
    return response.rows[0]
}


export const toggleRewardActiveService = async (id: number) => {
    const response = await pool.query(`update rewards set is_active = not is_active
        where id = $1
        RETURNING is_active`,
        [id]
    )

    if (response.rowCount === 0) {
        throw new AppError("rewards Not Found", 404)
    }

    return response.rows[0]
}
