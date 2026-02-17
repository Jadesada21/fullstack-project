import { pool } from '../db/connectPostgre'

import {
    ProductResponse,
    CreateProductInput
} from '../types/product.type'

export const getAllProductService = async () => {
    try {
        const sql = ` select 
        id,
        name,
        description,
        short_description,
        price,
        stock,
        roast_level,
        category_id,
        is_active,
        created_at,
        updated_at
        from products
        `
        const response = await pool.query(sql)
        return response.rows
    } catch (err) {
        console.error('getAllProductService error', err)
        throw err
    }
}

export const createProductService = async (
    body: CreateProductInput
): Promise<ProductResponse> => {
    try {
        const { name, description, short_description, price, stock, category_id, roast_level } = body

        const response = await pool.query(`
        insert into products 
        (name , description ,short_description, price , stock , category_id , roast_level)
        values($1,$2,$3,$4,$5,$6,$7)
        returning 
        name , description ,short_description, price , stock , category_id , roast_level`,
            [name, description, short_description, price, stock, category_id, roast_level]
        )
        return response.rows[0]
    } catch (err) {
        console.error('createProductService error', err)
        throw err
    }
}