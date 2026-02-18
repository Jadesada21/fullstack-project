import { pool } from '../db/connectPostgre'


export const getAllCustomerAddressService = async () => {

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
}
