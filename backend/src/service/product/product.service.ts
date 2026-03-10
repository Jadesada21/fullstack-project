import { pool } from '../../db/connectPostgre.repository'
import { AppError } from '../../util/AppError'

import {
    ProductResponse,
    CreateProductInput
} from '../../types/product/product.type'

import { Role } from '../../types/users.type'

export const getAllProductService = async (role?: Role | 'guest') => {
    if (role === 'admin') {
        const sql = ` select 
        p.id,
        p.name,
        p.description,
        p.short_description,
        p.price,
        p.stock,
        p.reward_points,
        p.roast_level,
        p.category_id,
        p.is_active,
        p.created_at,
        p.updated_at,
        coalesce(img.total_images , 0) as total_images
    from products p 
    left join (
        select 
            product_id,
            count(*) as total_images
        from product_images
        group by product_id 
    ) img on img.product_id = p.id
    order by p.created_at desc
        `
        const response = await pool.query(sql)
        return response.rows
    } else {
        const sql = `
        select  
        p.id,
        p.name,
        p.short_description,
        p.price,
        p.reward_points,
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

    const { name, description, short_description, price, stock, reward_points, category_id, roast_level } = body

    const checkCategory = await pool.query(`
    select id from categories where id = $1    
    `, [category_id])

    if (checkCategory.rowCount === 0) {
        throw new AppError("Categories not found", 400)
    }

    const response = await pool.query(`
        insert into products 
        (name , description ,short_description, price , stock ,reward_points, category_id , roast_level)
        values($1,$2,$3,$4,$5,$6,$7,$8)
        returning *`,
        [name, description, short_description, price, stock, reward_points, category_id, roast_level]
    )
    return response.rows[0]
}


export const getProductByIdService = async (id: number, role?: Role | 'guest') => {
    if (role === 'admin') {
        const sql = ` select 
        p.id,
        p.name,
        p.description,
        p.short_description,
        p.price,
        p.stock,
        p.reward_points,
        p.roast_level,
        p.category_id,
        p.is_active,
        p.created_at,
        p.updated_at,
        coalesce(img.total_images , 0) as total_images
    from products p 
    left join (
        select 
            product_id,
            count(*) as total_images
        from product_images
        group by product_id 
    ) img on img.product_id = p.id
     where p.id = $1
        `
        const response = await pool.query(sql, [id])
        if (response.rowCount === 0) {
            throw new AppError("Product not found", 404)
        }
        return response.rows[0]
    } else {
        const sql = `
        select  
        p.id,
        p.name,
        p.short_description,
        p.price,
        p.reward_points,
        p.reward_points as points,
        pi.image_url
    from products p
    left join product_images pi 
        on pi.product_id = p.id 
        and pi.is_primary = true
        where p.id = $1
        and p.is_active = true
        `
        const response = await pool.query(sql, [id])
        if (response.rowCount === 0) {
            throw new AppError("Product not found", 404)
        }
        return response.rows[0]
    }

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

export const restockProductByIdService = async (
    productId: number,
    quantity: number
) => {
    const client = await pool.connect()

    try {
        await client.query("BEGIN")

        // check product exist
        const productResult = await client.query(`
            select id from products where id = $1
            `, [productId])

        if (productResult.rowCount === 0) {
            throw new AppError("Product not found", 400)
        }

        // update product stock
        await client.query(
            `
      update products
      set stock = stock + $1
      where id = $2
      `,
            [quantity, productId]
        )

        // insert stock movement
        const movementResult = await client.query(`
            insert into stock_movements
            (item_type , item_id , quantity , movement_type , reference_type)
            values('product' , $1 , $2 ,'restock' , 'admin')
            returning *
            `, [productId, quantity])

        await client.query("COMMIT")

        return movementResult.rows[0]
    } catch (err) {
        await client.query("ROLLBACK")
        throw err
    } finally {
        client.release()
    }
}

export const getAllRestockProductHisService = async (productId: number) => {
    const response = await pool.query(`
        select *
            from stock_movements
        where item_type = 'product'
        and item_id = $1
        and movement_type = 'restock'
        order by created_at desc
        `, [productId])

    return response.rows
}