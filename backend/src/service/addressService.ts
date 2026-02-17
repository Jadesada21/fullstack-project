import { pool } from '../db/connectPostgre'

import {
    UpdateCustomerAddressInput,
    AddCustomerAddressByIdInput,
    CustomerAddressResponse
} from '../types/address.type'

export const getAllCustomerAddressService = async () => {
    try {
        const sql = ` select
        id,
        customer_id,
        country,
        address_line,
        subdistrict,
        district,
        province,
        postal_code,
        is_default,
        created_at,
        updated_at
        from customer_addresses 
        order by id desc`
        const response = await pool.query(sql)

        return response.rows
    } catch (err) {
        console.error('getAllCustomerAddressService error', err)
        throw err
    }
}

export const createCustomerAddressByIdService = async (customerId: number, body: AddCustomerAddressByIdInput): Promise<CustomerAddressResponse> => {
    try {
        const { address_line, country, province, district, subdistrict, postal_code, is_default } = body

        const responese = await pool.query(
            `insert into customer_addresses
    (customer_id , address_line ,country, province, district, subdistrict, postal_code , is_default)
    values($1,$2,$3,$4,$5,$6,$7,$8)
    returning 
    id, customer_id , address_line ,country, province, district, subdistrict, postal_code , is_default , created_at ,updated_at `,
            [customerId, address_line, country, province, district, subdistrict, postal_code, is_default]
        )

        return responese.rows[0]
    } catch (err) {
        console.error('addCustomerAddressByIdService error', err)
        throw err
    }
}


export const updateAddressCustomerByIdService = async (customerId: number, id: number, body: UpdateCustomerAddressInput) => {
    try {
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
        return response.rows[0] || null
    } catch (err) {
        console.error('updateAddressCustomerByIdService error', err)
        throw err
    }
}