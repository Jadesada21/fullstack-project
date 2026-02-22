import { pool } from '../../db/connectPostgre.repository'
import { AppError } from '../../util/AppError'

import {
    ProductImageInput,
    ProductImageResponse,
    DeleteProductImagesInput,
    setPrimaryImageInput,
    setSortOrderImageInput
} from '../../types/product/image.type'


export const uploadImageProductByIdService = async (product_id: number, images: ProductImageInput[]): Promise<ProductImageResponse[]> => {

    if (!images || images.length === 0) {
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
        const primaryCount = images.filter(i => i.is_primary === true).length
        if (primaryCount > 1) {
            throw new AppError("Only one Primary image Allowed", 400)
        }

        const existingPrimary = await client.query(`
            select id from product_images
            where product_id = $1 and is_primary = true`,
            [product_id]
        )

        // ถ้ามี primary ใน request ให้ใช้ primary ตัวเดิม
        if (primaryCount === 1) {
            await client.query(
                `update product_images
                set is_primary = false
                where product_id = $1`,
                [product_id]
            )
        }

        // ถ้าไม่มี primary เลยทั้ง request และใน DB
        if (primaryCount === 0 && existingPrimary.rowCount === 0) {
            images[0].is_primary = true
        }

        // sort auto run 
        const maxSortResult = await client.query(`
            select coalesce(max(sort_order), 0)as masx
            from product_images
            where product_id = $1`,
            [product_id]
        )

        let currentSort = Number(maxSortResult.rows[0].max)

        images.forEach(img => {
            if (img.sort_order === undefined || img.sort_order === null) {
                currentSort++
                img.sort_order = currentSort
            }
            if (img.is_primary === undefined) {
                img.is_primary = false
            }
        })

        // เตรียม insert [images]
        const values: any[] = []

        const placeholders = images.map((img, index) => {
            const base = index * 4

            values.push(
                product_id,
                img.image_url,
                img.is_primary,
                img.sort_order
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


export const getImageProductByIdService = async (id: number) => {
    const response = await pool.query(
        `select * from products where id = $1`,
        [id]
    )
    if (response.rowCount === 0) {
        throw new AppError("Product not found", 404)
    }
    return response.rows[0]
}


export const updatePrimaryImagesByIdService = async (product_id: number, body: setPrimaryImageInput) => {
    const { image_id } = body

    const client = await pool.connect()

    try {
        await client.query("BEGIN")

        const checkImage = await client.query(
            `select id from product_images 
            where id = $1 and product_id = $2`,
            [image_id, product_id]
        )

        if (checkImage.rowCount === 0) {
            throw new AppError("Image not found in this product", 400)
        }


        // reset Primary and update primary
        const result = await client.query(`
            update product_images
            set is_primary = case
            when id = $1 then true
            else false 
            end 
            where product_id = $2
            returning *
            `,
            [image_id, product_id]
        )

        if (result.rowCount === 0) {
            throw new AppError("No images to update", 400)
        }

        await client.query("COMMIT")

        const primaryImage = result.rows.find(r => r.id === image_id)

        return primaryImage

    } catch (err) {
        await client.query("ROLLBACK")
        throw err
    } finally {
        client.release()
    }
}


export const updateSortOrderByIdService = async (product_id: number, body: setSortOrderImageInput) => {
    const { image_ids } = body

    if (!image_ids || image_ids.length === 0) {
        throw new AppError("Image_id required", 400)
    }

    const client = await pool.connect()
    try {
        await client.query("BEGIN")

        const checkProduct = await client.query(`
            select id from products where id =$1`,
            [product_id]
        )

        if (checkProduct.rowCount === 0) {
            throw new AppError("Product not fount ", 400)
        }

        const checkImage = await client.query(`
            select id from product_images
            where product_id = $1
            and id = any($2::int[])`,
            [product_id, image_ids]
        )

        if (checkImage.rowCount !== image_ids.length) {
            throw new AppError("Some image not found in this product ", 400)
        }


        await client.query(`
            update product_images pi
            set sort_order = new_order.sort_order,
            is_primary = case 
            when  new_order.sort_order = 1 then true 
            else false 
            end
            from (
            select unnest($1::int[])as id ,
            generate_series(1 , array_length($1::int[] ,1))as sort_order
            ) as new_order
            where pi.id = new_order.id
            and pi.product_id = $2
            `,
            [image_ids, product_id])

        await client.query("COMMIT")
    } catch (err) {
        await client.query("ROLLBACK")
        throw err
    } finally {
        client.release()
    }
}


export const deleteProductImagesByIdService = async (product_id: number, body: DeleteProductImagesInput) => {

    const { image_ids } = body

    if (!image_ids || image_ids.length === 0) {
        throw new AppError("image ids are required", 400)
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

        const result = await client.query(
            `delete from product_images 
            where product_id = $1
            and id  = any($2::int[])
            returning * `,
            [product_id, image_ids]
        )

        if (result.rowCount !== image_ids.length) {
            throw new AppError("Some images not found in this product", 400)
        }

        const remaining = await client.query(`
            select id from product_images
            where product_id = $1
            order by sort_order asc
            limit 1`,
            [product_id]
        )

        if (remaining.rows.length > 0) {
            await client.query(`
            update product_images
            set is_primary = true
            where id = $1`,
                [remaining.rows[0].id]
            )
        }

        await client.query("COMMIT")

        return {
            delete_count: result.rowCount,
            delete_images: result.rows
        }
    } catch (err) {
        await client.query("ROLLBACK")
        throw err
    } finally {
        client.release()
    }
}