import { pool } from '../../db/connectPostgre.repository'
import { AppError } from '../../util/AppError'

import {
    ProductResponse,
    CreateProductInput
} from '../../types/product/product.type'

export const getAllProductService = async (role?: string) => {
    if (role === 'admin') {
        const sql = ` select 
        p.id,
        p.name,
        p.description,
        p.short_description,
        p.price,
        p.stock,
        p.roast_level,
        p.category_id,
        p.is_active,
        p.created_at,
        p.updated_at,
        count(pi.id) as total_images
        from products p 
        left join product_images pi
        on pi.product_id = p.id 
        group by p.id
        order by p.created_at desc 
        `
        const response = await pool.query(sql)
        return response.rows
    } else {
        const sql = `
        select
        p.id,
        p.name,
        p.price,
        pi.image_url
        from products p
        left join product_images pi 
        on pi.product_id = p.id 
        and pi.is_primary = true
        where p.is_active = true
        order by p.created_at desc`
        const response = await pool.query(sql)
        return response.rows
    }
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
