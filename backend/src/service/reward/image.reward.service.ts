import { pool } from '../../db/connectPostgre.repository'
import { AppError } from '../../util/AppError'

import {
    RewardImageMetaInput,
    RewardImageResponse,
    DeleteRewardImagesInput,
    setPrimaryImageInput,
    setSortOrderImageInput
} from '../../types/reward/image.type'
import cloudinary from '../../config/cloudinary'


export const uploadImageRewardByIdService = async (
    reward_id: number,
    files: Express.Multer.File[],
    imagesMeta: RewardImageMetaInput[] = []
): Promise<RewardImageResponse[]> => {

    if (!files || files.length === 0)
        throw new AppError("No files uploaded", 400)

    const client = await pool.connect()

    try {
        await client.query("BEGIN")

        const checkReward = await client.query(
            `select id from rewards where id = $1`,
            [reward_id]
        )

        if (checkReward.rowCount === 0) {
            throw new AppError("Reward not found", 400)
        }

        imagesMeta = Array.isArray(imagesMeta) ? imagesMeta : []

        // Check primary
        const primaryCount = imagesMeta.filter(i => i.is_primary === true).length
        if (primaryCount > 1) {
            throw new AppError("Only one Primary image Allowed", 400)
        }

        const existingPrimary = await client.query(`
            select id from reward_images
            where reward_id = $1 and is_primary = true`,
            [reward_id]
        )

        // ถ้ามี primary ใหม่ → reset ของเก่า
        if (primaryCount === 1) {
            await client.query(
                `update reward_images
                set is_primary = false
                where reward_id = $1`,
                [reward_id]
            )
        }

        // get max sort auto run 
        const maxSortResult = await client.query(`
            select coalesce(max(sort_order), 0)as masx
            from reward_images
            where reward_id = $1`,
            [reward_id]
        )

        let currentSort = Number(maxSortResult.rows[0].max) || 0

        // เตรียม insert [images]

        const uploadedResults: RewardImageResponse[] = []

        for (let i = 0; i < files.length; i++) {
            const file = files[i]
            const meta = imagesMeta[i] || {}

            //auto primary ถ้าไม่มี primary ทั้ง request และ DB
            if (primaryCount === 0 &&
                existingPrimary.rowCount === 0 &&
                i === 0
            ) {
                meta.is_primary = true
            }

            meta.is_primary = meta.is_primary === true


            if (meta.sort_order == null) {
                currentSort++
                meta.sort_order = currentSort
            }

            const safeSortOrder = Number(meta.sort_order) || 0

            const uploadResult = await cloudinary.uploader.upload(
                `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
                {
                    folder: "rewards",
                }
            )

            const insertResult = await client.query<RewardImageResponse>(
                `insert into reward_images
                (reward_id , image_url , public_id ,is_primary , sort_order)
                values($1,$2,$3,$4,$5 )
                returning *`,
                [reward_id,
                    uploadResult.secure_url,
                    uploadResult.public_id,
                    meta.is_primary,
                    safeSortOrder
                ]
            )
            uploadedResults.push(insertResult.rows[0])
        }

        await client.query("COMMIT")

        return uploadedResults
    } catch (err) {
        await client.query("ROLLBACK")
        throw err
    } finally {
        client.release()
    }
}


export const getImageRewardByIdService = async (id: number) => {
    const response = await pool.query(
        `select
        image_url,
        is_primary,
        sort_order,
        created_at
        from rewards where id = $1`,
        [id]
    )
    if (response.rowCount === 0) {
        throw new AppError("reward not found", 404)
    }
    return response.rows[0]
}


export const updatePrimaryImagesByIdService = async (reward_id: number, body: setPrimaryImageInput) => {
    const { image_id } = body

    const client = await pool.connect()

    try {
        await client.query("BEGIN")

        const checkImage = await client.query(
            `select id from reward_images 
            where id = $1 and reward_id = $2`,
            [image_id, reward_id]
        )

        if (checkImage.rowCount === 0) {
            throw new AppError("Image not found in this reward", 400)
        }


        // reset Primary and update primary
        const result = await client.query(`
            update reward_images
            set is_primary = case
            when id = $1 then true
            else false 
            end 
            where reward_id = $2
            returning *
            `,
            [image_id, reward_id]
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


export const updateSortOrderByIdService = async (reward_id: number, body: setSortOrderImageInput) => {
    const { image_ids } = body

    if (!image_ids || image_ids.length === 0) {
        throw new AppError("Image_id required", 400)
    }

    const client = await pool.connect()
    try {
        await client.query("BEGIN")

        const checkReward = await client.query(`
            select id from rewards where id =$1`,
            [reward_id]
        )

        if (checkReward.rowCount === 0) {
            throw new AppError("Reward not fount ", 400)
        }

        const checkImage = await client.query(`
            select id from reward_images
            where reward_id = $1
            and id = any($2::int[])`,
            [reward_id, image_ids]
        )

        if (checkImage.rowCount !== image_ids.length) {
            throw new AppError("Some image not found in this reward ", 400)
        }


        await client.query(`
            update reward_images pi
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
            and pi.reward_id = $2
            `,
            [image_ids, reward_id])

        await client.query("COMMIT")
    } catch (err) {
        await client.query("ROLLBACK")
        throw err
    } finally {
        client.release()
    }
}


export const deleteRewardImagesByIdService = async (
    reward_id: number,
    body: DeleteRewardImagesInput) => {

    const { image_ids } = body

    if (!image_ids || image_ids.length === 0) {
        throw new AppError("image ids are requ  ired", 400)
    }

    const client = await pool.connect()

    try {
        await client.query("BEGIN")

        const checkReward = await client.query(
            `select id from rewards where id = $1`,
            [reward_id]
        )

        if (checkReward.rowCount === 0) {
            throw new AppError("Reward not found", 400)
        }

        const images = await client.query(`
            select id , public_id from reward_images
            where reward_id =$1
            and id = any($2::int[])`,
            [reward_id, image_ids]
        )

        if (images.rowCount !== image_ids.length)
            throw new AppError("Some images not found in this reward", 400)

        for (const img of images.rows) {
            await cloudinary.uploader.destroy(img.public_id)
        }

        const result = await client.query(
            `delete from reward_images 
            where reward_id = $1
            and id  = any($2::int[])
            returning * `,
            [reward_id, image_ids]
        )

        if (result.rowCount !== image_ids.length) {
            throw new AppError("Some images not found in this reward", 400)
        }

        const remaining = await client.query(`
            select id from reward_images
            where reward_id = $1
            order by sort_order asc
            limit 1`,
            [reward_id]
        )

        if (remaining.rows.length > 0) {
            await client.query(`
            update reward_images
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