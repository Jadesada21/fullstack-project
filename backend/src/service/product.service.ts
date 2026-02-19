import { pool } from '../db/connectPostgre.repository'
import { AppError } from '../util/AppError'

import {
    ProductResponse,
    CreateProductInput
} from '../types/product.type'

export const getAllProductService = async () => {
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
}


export const createProductService = async (
    body: CreateProductInput
): Promise<ProductResponse> => {

    const { name, description, short_description, price, stock, category_id, roast_level } = body

    const response = await pool.query(`
        insert into products 
        (name , description ,short_description, price , stock , category_id , roast_level)
        values($1,$2,$3,$4,$5,$6,$7)
        returning *`,
        [name, description, short_description, price, stock, category_id, roast_level]
    )
    return response.rows[0]
}


export const getProductByIdService = async (id: number) => {
    const response = await pool.query(
        `select * from products where id = $1`,
        [id]
    )
    if (response.rowCount === 0) {
        throw new AppError("Product not found", 404)
    }
    return response.rows[0]
}


export const toggleProductActiveService = async (id: number) => {

    const response = await pool.query(`update products set is_active = not is_active
        where id = $1
        RETURNING is_active`,
        [id]
    )

    if (response.rowCount === 0) {
        throw new AppError("Products Not Found", 404)
    }

    return response.rows[0]
}
