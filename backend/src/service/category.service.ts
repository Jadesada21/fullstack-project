import { pool } from '../db/connectPostgre.repository'
import { AppError } from '../util/AppError'

import {
    CreateCategoryInput
} from '../types/category.type'

export const getAllCategoryService = async () => {
    const sql = `select 
    id , 
    name ,
    parent_id,
    type,
    created_at,
    updated_at
    from categories order by id desc
    `
    const response = await pool.query(sql)
    return response.rows
}


export const createCategoryService = async (body: CreateCategoryInput) => {
    const { name, parent_id, type } = body

    if (!name) {
        throw new AppError("Category name is required", 400)
    }

    if (!['product', 'reward'].includes(type)) {
        throw new AppError("Invalid category type", 400)
    }
    const response = await pool.query(`insert into categories 
        (name , parent_id , type)
        values($1 ,$2 ,$3)
        returning
        id ,name , parent_id , type ,created_at , updated_at`,
        [name, parent_id ?? null, type])

    return response.rows[0]
}


export const getCategoryByIdService = async (id: number) => {
    const sql = `select 
        id,
        name,
        parent_id,
        created_at,
        updated_at
        from categories where id = $1`
    const response = await pool.query(sql, [id])

    if (response.rowCount === 0) {
        throw new AppError("Category not found", 404)
    }
    return response.rows[0]
}


export const getCategoryProductsByIdService = async (id: number) => {
    const categorieResult = await pool.query(
        `select id , name  from categories where id = $1`,
        [id]
    )

    if (categorieResult.rowCount === 0) {
        throw new AppError("Categories not found ", 404)
    }

    const productsResult = await pool.query(
        `select id , name , price , stock , roast_level from products where category_id = $1`,
        [id]
    )

    return {
        ...categorieResult.rows[0],
        products: productsResult.rows
    }
}

export const getCategoryRewardsByIdService = async (id: number) => {
    const categorieResult = await pool.query(
        `select id , name from categories where id = $1`,
        [id]
    )

    if (categorieResult.rowCount === 0) {
        throw new AppError("Categories not found ", 404)
    }

    const rewardsResult = await pool.query(
        `select id , name , points_required , stock from rewards where category_id =$1`,
        [id]
    )

    return {
        ...categorieResult.rows[0],
        rewards: rewardsResult.rows
    }
}