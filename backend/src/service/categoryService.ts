import { pool } from '../db/connectPostgre'

import {
    CreateCategoryInput
} from '../types/category.type'

export const getAllCategoryService = async () => {
    try {
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
    } catch (err) {
        console.error('getAllCategoryService error', err)
        throw err
    }
}

export const createCategoryService = async (body: CreateCategoryInput) => {
    try {
        const { name, parent_id } = body

        if (!name) {
            throw new Error("Category name is required")
        }

        const response = await pool.query(`insert into categories 
        (name , parent_id)
        values($1 ,$2)
        returning
        name , parent_id , created_at , updated_at`,
            [name, parent_id ?? null])

        return response.rows[0]
    } catch (err) {
        console.error('createCategoryService error', err)
        throw err
    }
}

export const getCategoryByIdService = async (id: number) => {
    try {
        const sql = `select 
        id,
        name,
        parent_id,
        created_at,
        updated_at
        from categories where id = $1`
        const response = await pool.query(sql, [id])
        return response.rows[0] || null
    } catch (err) {
        console.error('getCategoryById error', err)
        throw err
    }
}