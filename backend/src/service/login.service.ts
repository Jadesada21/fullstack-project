import { pool } from '../db/connectPostgre.repository'
import jwt from 'jsonwebtoken'
import { AppError } from '../util/AppError'
import bcrypt from 'bcrypt'

import {
    LoginResponse
} from '../types/login.type'


export const loginService = async (username: string, password: string): Promise<LoginResponse> => {

    const result = await pool.query(
        `select id , username ,password, role, is_active from users where username = $1`,
        [username]
    )

    if (result.rowCount === 0) {
        throw new AppError("Invalid credentials", 401)
    }

    const user = result.rows[0]

    if (!user.is_active) {
        throw new AppError("Account is inactive", 403)
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new AppError("Invalid credentials", 401)
    }

    const token = jwt.sign(
        {
            id: user.id,
            role: user.role
        },
        process.env.JWT_SECRET as string,
        {
            expiresIn: '1d'
        }
    )
    return {
        token,
        user: {
            id: user.id,
            username: user.username,
            role: user.role
        }
    }
}

export const getProductBySearchService = async (keyword: string) => {
    const response = await pool.query(`
        select distinct on (p.id)
            p.id,
            p.name,
            p.price,
            pi.image_url
        from products p
        left join product_images pi
            on p.id = pi.product_id
            and pi.is_primary = true
        where p.name ilike '%' || $1 || '%'
        limit 6
        `, [keyword])

    return response.rows
}