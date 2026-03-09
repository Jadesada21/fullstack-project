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
    const response = await pool.query(
        `select 
        id,
        username,
        email,
        first_name,
        last_name,
        phone_num,
        role,
        is_active,
        points,
        created_at,
        updated_at
        from users order by id desc`
    )
    return response.rows
}


export const getUsersByIdService = async (targetUserId: number, loginUserId: number) => {

    if (targetUserId !== loginUserId) {
        throw new AppError("Forbidden", 403)
    }

    const response = await pool.query(
        `Select * from users where id = $1`
        , [targetUserId])

    if (response.rowCount === 0) {
        throw new AppError("Users not found", 404)
    }

    return response.rows[0]
}


export const updateUsersByLoginUserService = async (loginUserId: number, body: UpdateUsersPhoneInput) => {
    const { first_name, last_name, phone_num } = body

    const response = await pool.query(
        `update users
        set 
            first_name = COALESCE($1, first_name),
            last_name = COALESCE($2, last_name),
            phone_num = COALESCE($3, phone_num)
        where id = $4
        returning id ,first_name , last_name , phone_num`,
        [first_name, last_name, phone_num, loginUserId]
    )

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
            [userId, address_line, country, province, district, subdistrict, postal_code, is_default ?? false]
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


export const updateAddressUserByLoginUserService = async (userId: number, id: number, body: UpdateUsersAddressInput) => {
    const client = await pool.connect()
    try {

        await client.query("BEGIN")

        if (body.is_default === true) {
            await client.query(`
                update users_addresses
                set is_default = false
                where user_id = $1
                `, [userId]
            )
        }

        // dynamic update
        const fields: string[] = []
        const values: any[] = []
        let index = 1

        const allowedFields = [
            "address_line",
            "country",
            "province",
            "district",
            "subdistrict",
            "postal_code",
            "is_default"
        ]

        for (const key in body) {
            if (!allowedFields.includes(key)) continue

            fields.push(`${key} = $${index}`)
            values.push(body[key as keyof UpdateUsersAddressInput])
            index++
        }

        if (fields.length === 0) {
            throw new AppError("No field to update", 400)
        }

        const sql = `update users_addresses
        set ${fields.join(', ')},
        updated_at = current_timestamp
        where id = $${index}
        and user_id = $${index + 1}
        returning *`

        values.push(id, userId)


        const response = await client.query(sql, values)

        if (response.rowCount === 0) {
            throw new AppError("Address not found", 404)
        }
        await client.query("COMMIT")
        return response.rows[0]

    } catch (err) {
        await client.query("ROLLBACK")
        throw err
    } finally {
        client.release()
    }
}

export const getAllMyAddressService = async (userId: number) => {
    const response = await pool.query(`
        select * from users_addresses
        where user_id =$1
        `, [userId,])

    if (response.rowCount === 0) {
        throw new AppError("Addresses not found", 400)
    }

    return response.rows
}

export const setdefaultAddressService = async (userId: number, addressId: number) => {
    const client = await pool.connect()
    try {
        await client.query("BEGIN")

        // off default all address
        await client.query(`
            update users_addresses
            set is_default = case
                when id = $1 then true
                else false
            end
            where user_id = $2
            `, [addressId, userId])


        const result = await client.query(`
            select * from users_addresses where id = $1 and user_id = $2
            `, [addressId, userId])

        if (result.rowCount === 0) {
            throw new AppError("Address not found", 404)
        }

        await client.query("COMMIT")

        return result.rows[0]

    } catch (err) {
        await client.query("ROLLBACK")
        throw err
    } finally {
        client.release()
    }
}