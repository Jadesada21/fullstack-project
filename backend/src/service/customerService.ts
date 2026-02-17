import { pool } from '../db/connectPostgre'
import bcrypt from 'bcrypt'
import {
    CreateCustomerInput,
    CustomerResponse,
    UpdateCustomerPhoneInput,
} from '../types/customer.type'


export const getAllCustomerService = async () => {
    try {
        const sql = `select 
        id,
        username,
        email,
        first_name,
        last_name,
        phone_num,
        role,
        is_active,
        total_points,
        created_at,
        updated_at
        from customers order by id desc`
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
        const { username, password, email, first_name, last_name, phone_num } = body

        const defaultRole = "customer"

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

        const responese = await pool.query(
            `insert into customers
        (username , password ,email ,first_name , last_name ,role , phone_num)
        values($1,$2,$3,$4,$5,$6,$7)
        returning 
        id ,username  , email , first_name , last_name  , role ,phone_num`,
            [username, hashedPassword, email, first_name, last_name, defaultRole, phone_num]
        )

        return responese.rows[0]
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


export const updateCustomerByIdService = async (id: number, body: UpdateCustomerPhoneInput) => {
    try {
        const { phone_num } = body

        const sql = `update customers 
        set phone_num = $1
        where id = $2
        returning id ,phone_num`

        const response = await pool.query(sql, [phone_num, id])
        console.log(response)

        return response.rows[0] || null
    } catch (err) {
        console.error('updateCustomerByIdService error', err)
        throw err
    }
}

