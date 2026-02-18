import { pool } from '../db/connectPostgre'
import { AppError } from "../util/AppError"


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
        throw new AppError("Customer Address not found", 404)
    }
}
