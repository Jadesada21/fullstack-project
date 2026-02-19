import { pool } from '../db/connectPostgre'
import jwt from 'jsonwebtoken'
import { AppError } from '../util/AppError'
import bcrypt from 'bcrypt'

import {
    LoginResponse
} from '../types/login.type'




export const loginService = async (username: string, password: string): Promise<LoginResponse> => {

    const customers = await pool.query(
        `select id , username ,password, role, is_active from customers where username = $1`,
        [username]
    )
    if (customers.rowCount === 0) {
        throw new AppError("Invalid credentials", 401)
    }

    const customer = customers.rows[0]

    if (!customer.is_active) {
        throw new AppError("Account is inactive", 403)
    }

    const isMatch = await bcrypt.compare(password, customer.rows[0].password)

    if (!isMatch) {
        throw new AppError("Invalid credentials", 401)
    }

    const token = jwt.sign(
        {
            id: customer.rows[0].id,
            role: customer.rows[0].role
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