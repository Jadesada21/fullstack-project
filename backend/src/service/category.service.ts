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
    created_at,
    updated_at
    from categories order by id desc
    `
    const response = await pool.query(sql)
    return response.rows
}


export const createCategoryService = async (body: CreateCategoryInput) => {
    const { name, parent_id } = body

    if (!name) {
        throw new AppError("Category name is required", 400)
    }

    const response = await pool.query(`insert into categories 
        (name , parent_id)
        values($1 ,$2)
        returning
        name , parent_id , created_at , updated_at`,
        [name, parent_id ?? null])

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