import { pool } from "../db/connectPostgre.repository"
import { AppError } from "../util/AppError"
import bcrypt from 'bcrypt'


import {
    CreateCustomerInput,
    CustomerResponse
} from "../types/customer.type"




export const createCustomerService = async (
    body: CreateCustomerInput
): Promise<CustomerResponse> => {

    const { username, password, email, first_name, last_name, phone_num } = body

    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        const response = await pool.query(
            `insert into customers
        (username , password ,email ,first_name , last_name ,role , phone_num)
        values($1,$2,$3,$4,$5,$6,$7)
        returning 
        id ,username  , email , first_name , last_name  , role , phone_num`,
            [username, hashedPassword, email, first_name, last_name, 'customer', phone_num]
        )

        return response.rows[0]
    } catch (err: any) {
        if (err.code === '23505') {
            throw new AppError("Username or email already exists", 409)
        }

        throw err
    }

}