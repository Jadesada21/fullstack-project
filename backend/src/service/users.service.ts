import { pool } from '../db/connectPostgre.repository'
import { AppError } from '../util/AppError'


import {
    UpdateUsersPhoneInput,
} from '../types/users.type'

import {
    UpdateUsersAddressInput,
    AddUsersAddressByIdInput,
    UsersAddressResponse
} from '../types/address.type'


export const getAllUsersService = async () => {
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
        from users order by id desc`
    const response = await pool.query(sql)
    return response.rows
}


export const getUsersByIdService = async (id: number) => {
    const sql = `Select * from users where id = $1`
    const response = await pool.query(sql, [id])

    if (response.rowCount === 0) {
        throw new AppError("Users not found", 404)
    }

    return response.rows[0]
}


export const updateUsersByIdService = async (id: number, body: UpdateUsersPhoneInput) => {
    const { phone_num } = body

    const sql = `update users
        set phone_num = $1
        where id = $2
        returning id ,phone_num`

    const response = await pool.query(sql, [phone_num, id])

    if (response.rowCount === 0) {
        throw new AppError("User not found", 404)
    }

    return response.rows[0]
}


// *************************** ADDRESS


export const getAllUsersAddressService = async () => {

    const sql = ` select
        id,
        user_id,
        country,
        address_line,
        subdistrict,
        district,
        province,
        postal_code,
        is_default,
        created_at,
        updated_at
        from users_addresses 
        order by id desc`
    const response = await pool.query(sql)
    return response.rows
}


export const createUsersAddressByIdService = async (userId: number, body: AddUsersAddressByIdInput): Promise<UsersAddressResponse> => {
    const client = await pool.connect()
    try {
        await client.query("BEGIN")

        // check user
        const user = await client.query(
            `select id from users where id = $1`,
            [userId]
        )

        if (user.rowCount === 0) {
            throw new AppError("User not found", 404)
        }

        const { address_line, country, province, district, subdistrict, postal_code, is_default } = body

        // if default set default
        if (is_default) {
            await client.query(
                `update users_addresses
                set is_default = false
                where user_id = $1`,
                [userId]
            )
        }

        // insert
        const response = await client.query(
            `insert into users_addresses
            (user_id , address_line ,country, province, district, subdistrict, postal_code , is_default)
            values($1,$2,$3,$4,$5,$6,$7,$8)
            returning 
            id, user_id , address_line ,country, province, district, subdistrict, postal_code , is_default , created_at ,updated_at `,
            [userId, address_line, country, province, district, subdistrict, postal_code, is_default]
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


export const updateAddressUserByIdService = async (userId: number, id: number, body: UpdateUsersAddressInput) => {
    console.log("userId:", userId)
    console.log("addressId:", id)
    const fields: string[] = []
    const values: any[] = []
    let index = 1

    for (const key in body) {
        fields.push(`${key} = $${index}`)
        values.push(body[key as keyof UpdateUsersAddressInput])
        index++
    }

    if (fields.length === 0) return null

    const sql = `update users_addresses
        set ${fields.join(', ')},
        updated_at = current_timestamp
        where id = $${index}
        and user_id = $${index + 1}
        returning *`

    values.push(id, userId)


    const response = await pool.query(sql, values)

    if (response.rowCount === 0) {
        throw new AppError("Address not found", 404)
    }
    return response.rows[0]
}
