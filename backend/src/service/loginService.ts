import { pool } from '../db/connectPostgre'
import jwt from 'jsonwebtoken'
import { AppError } from '../util/AppError'
import bcrypt from 'bcrypt'

import {
    LoginResponse
} from '../types/login.type'




export const loginService = async (username: string, password: string): Promise<LoginResponse> => {

    const result = await pool.query(
        `select id , username ,password, role, is_active from customers where username = $1`,
        [username]
    )
    if (result.rowCount === 0) {
        throw new AppError("Invalid credentials", 401)
    }

    const customer = result.rows[0]

    if (!customer.is_active) {
        throw new AppError("Account is inactive", 403)
    }

    const isMatch = await bcrypt.compare(password, customer.password)

    if (!isMatch) {
        throw new AppError("Invalid credentials", 401)
    }

    const token = jwt.sign(
        {
            id: customer.id,
            role: customer.role
        },
        process.env.JWT_SECRET as string,
        {
            expiresIn: '1d'
        }
    )
    return {
        token,
        user: {
            id: customer.id,
            username: customer.username,
            role: customer.role
        }
    }
}