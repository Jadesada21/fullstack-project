import { pool } from '../db/connectPostgre.repository'
import bcrypt from 'bcrypt'
import { AppError } from '../util/AppError'


import {
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
    const client = await pool.connect()
    try {
        await client.query("BEGIN")

        // check customer
        const customer = await client.query(
            `select id from customers where id = $1`,
            [customerId]
        )

        if (customer.rowCount === 0) {
            throw new AppError("Customer not found", 404)
        }

        const { address_line, country, province, district, subdistrict, postal_code, is_default } = body

        // if default set default
        if (is_default) {
            await client.query(
                `update customer_addresses
                set is_default = false
                where customer_id = $1`,
                [customerId]
            )
        }

        // insert
        const response = await client.query(
            `insert into customer_addresses
            (customer_id , address_line ,country, province, district, subdistrict, postal_code , is_default)
            values($1,$2,$3,$4,$5,$6,$7,$8)
            returning 
            id, customer_id , address_line ,country, province, district, subdistrict, postal_code , is_default , created_at ,updated_at `,
            [customerId, address_line, country, province, district, subdistrict, postal_code, is_default]
        )

        await client.query("COMMIT")
        return response.rows[0]

    } catch (err) {
        await client.query("ROLLBACK")
        throw err
    } finally {
        client.release()
    }
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
        throw new AppError("Address not found", 404)
    }
    return response.rows[0]
}
