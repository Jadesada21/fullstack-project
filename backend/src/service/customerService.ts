import { pool } from '../db/connectPostgre'
import bcrypt from 'bcrypt'
import { CreateCustomerInput, CustomerResponse } from '../types/customer.type'

export const getAllCustomerService = async () => {
    try {
        const sql = `select * from customers order by id desc`
        const response = await pool.query(sql)
        return response.rows
    } catch (err) {
        console.error('getAllCustomerService error', err)
        throw err
    }

}

export const createCustomerService = async (
    body: CreateCustomerInput
): Promise<CustomerResponse> => {
    try {
        const { username, password, email, first_name, last_name, role } = body

        const checkUser = await pool.query(
            `Select id from customers where username =$1`,
            [username]
        )

        if (checkUser.rowCount && checkUser.rowCount > 0) {
            throw new Error("Username already exists")
        }

        const checkEmail = await pool.query(
            `Select id from customers where email =$1`,
            [email]
        )

        if (checkEmail.rowCount && checkEmail.rowCount > 0) {
            throw new Error("Email already exists")
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const result = await pool.query(
            `insert into customers
        (username , password ,email ,first_name , last_name , role)
        values($1,$2,$3,$4,$5,$6)
        returning *`,
            [username, hashedPassword, email, first_name, last_name, role]
        )
        return result.rows[0]
    } catch (err) {
        console.error('createCustomerService error', err)
        throw err
    }

}

export const getCustomerByIdService = async (id: number) => {
    try {
        const sql = `Select * from customers where id = $1`
        const response = await pool.query(sql, [id])
        console.log(response)
        return response.rows[0] || null
    } catch (err) {
        console.error('getCustomerById error', err)
        throw err
    }
}