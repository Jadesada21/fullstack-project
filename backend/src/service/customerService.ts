import { pool } from '../db/connectPostgre'
import bcrypt from 'bcrypt'
import { AppError } from '../util/AppError'


import {
    CreateCustomerInput,
    CustomerResponse,
    UpdateCustomerPhoneInput,
} from '../types/customer.type'

import {
    UpdateCustomerAddressInput,
    AddCustomerAddressByIdInput,
    CustomerAddressResponse
} from '../types/address.type'


export const getAllCustomerService = async () => {
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
}

export const createCustomerService = async (
    body: CreateCustomerInput
): Promise<CustomerResponse> => {

    const { username, password, email, first_name, last_name, phone_num } = body

    const defaultRole = "customer"

    const checkUser = await pool.query(
        `Select id from customers where username =$1`,
        [username]
    )

    if (checkUser.rowCount && checkUser.rowCount > 0) {
        throw new AppError("Username already exists", 409)
    }

    const checkEmail = await pool.query(
        `Select id from customers where email =$1`,
        [email]
    )

    if (checkEmail.rowCount && checkEmail.rowCount > 0) {
        throw new AppError("Email already exists", 409)
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

}

export const getCustomerByIdService = async (id: number) => {
    const sql = `Select * from customers where id = $1`
    const response = await pool.query(sql, [id])

    if (response.rowCount === 0) {
        throw new AppError("Customer not found", 404)
    }

    return response.rows[0]
}


export const updateCustomerByIdService = async (id: number, body: UpdateCustomerPhoneInput) => {
    const { phone_num } = body

    const sql = `update customers 
        set phone_num = $1
        where id = $2
        returning id ,phone_num`

    const response = await pool.query(sql, [phone_num, id])

    if (response.rowCount === 0) {
        throw new AppError("Customer not found", 404)
    }

    return response.rows[0]
}


// *************************** ADDRESS

export const createCustomerAddressByIdService = async (customerId: number, body: AddCustomerAddressByIdInput): Promise<CustomerAddressResponse> => {
    const customer = await pool.query(
        `select id from customers where id = $1`,
        [customerId]
    )

    if (customer.rowCount === 0) {
        throw new AppError("Customer not found", 404)
    }

    const { address_line, country, province, district, subdistrict, postal_code, is_default } = body

    const response = await pool.query(
        `insert into customer_addresses
    (customer_id , address_line ,country, province, district, subdistrict, postal_code , is_default)
    values($1,$2,$3,$4,$5,$6,$7,$8)
    returning 
    id, customer_id , address_line ,country, province, district, subdistrict, postal_code , is_default , created_at ,updated_at `,
        [customerId, address_line, country, province, district, subdistrict, postal_code, is_default]
    )
    return response.rows[0]
}


export const updateAddressCustomerByIdService = async (customerId: number, id: number, body: UpdateCustomerAddressInput) => {
    const fields: string[] = []
    const values: any[] = []
    let index = 1

    for (const key in body) {
        fields.push(`${key} = $${index}`)
        values.push(body[key as keyof UpdateCustomerAddressInput])
        index++
    }

    if (fields.length === 0) return null

    const sql = `update customer_addresses
        set ${fields.join(', ')},
        updated_at = current_timestamp
        where id = $${index}
        and customer_id = $${index + 1}
        returning *`

    values.push(id, customerId)

    const response = await pool.query(sql, values)

    if (response.rowCount === 0) {
        throw new AppError("Customer not found", 404)
    }
    return response.rows[0]
}
