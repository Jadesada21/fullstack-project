import { pool } from '../../db/connectPostgre.repository'
import { AppError } from '../../util/AppError'

import {
    ProductImageInput,
    ProductImageResponse
} from '../../types/product/image.type'


export const getAllImageProduct = async () => {
    const sql = ` select 
    id,
    product_id,
    image_url,
    is_primary,
    sort_order,
    created_at,
    updated_at 
    from product_image order by desc`

    const response = await pool.query(sql)
    return response.rows
}


export const uploadImageProductService = async (product_id: number, images: ProductImageInput[]): Promise<ProductImageResponse[]> => {

    if (!images || uploadImageProductService.length === 0) {
        throw new AppError("image are required", 400)
    }

    const client = await pool.connect()

    try {
        await client.query("BEGIN")

        const checkProduct = await client.query(
            `select id from products where id = $1`,
            [product_id]
        )

        if (checkProduct.rowCount === 0) {
            throw new AppError("Product not found", 400)
        }

        // Check primary
        const primaryCount = images.filter(i => i.is_primary).length
        if (primaryCount > 1) {
            throw new AppError("Only one Primary image Allowed", 400)
        }

        // ถ้ามี primary ใน request ให้ใช้ primary ตัวเดิม
        if (primaryCount === 1) {
            await client.query(
                `update product_images
                set is_primary = false
                where product_id = $1`,
                [product_id]
            )
        }

        // เตรียม insert [images]
        const values: any[] = []

        const placeholders = images.map((img, index) => {
            const base = index * 4

            values.push(
                product_id,
                img.image_url,
                img.is_primary ?? false,
                img.sort_order ?? 0
            )

            return `($${base + 1}, $${base + 2},$${base + 3},$${base + 4})`
        }).join(",")

        const insertQuery = `
        insert into product_images
        (product_id , image_url , is_primary , sort_order)
        values ${placeholders}
        returning *`

        const result = await client.query<ProductImageResponse>(
            insertQuery,
            values
        )

        await client.query("COMMIT")

        return result.rows
    } catch (err) {
        await client.query("ROLLBACK")
        throw err
    } finally {
        client.release()
    }
}