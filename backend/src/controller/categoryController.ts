import { Request, Response } from 'express'

import {
    getAllCategoryService,
    createCategoryService,
    getCategoryByIdService
} from '../service/categoryService'

import {
    CreateCategoryInput
} from '../types/category.type'

export const getAllCategory = async (req: Request, res: Response) => {
    try {
        const category = await getAllCategoryService()
        return res.status(200).json({ status: "Success", data: category })
    } catch (err: any) {
        return res.status(400).json({ status: "Failed", message: err.message })
    }
}


export const createCategory = async (req: Request<{}, {}, CreateCategoryInput>, res: Response) => {
    try {
        const { name } = req.body

        if (!name) {
            return res.status(400).json({ status: "Error", message: "Categories name required" })
        }

        const Newcategory = await createCategoryService(req.body)
        return res.status(201).json({ status: "Success", data: Newcategory })
    } catch (err: any) {
        return res.status(400).json({ status: "Failed", message: err.message })
    }
}

export const getCategoryById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id)
        if (isNaN(id)) {
            return res.status(400).json({ status: "Error", message: "Invalid customer ID" })
        }

        const data = await getCategoryByIdService(id)
        if (!data) {
            return res.status(400).json({ status: "Error", message: "Not Found categories" })
        }
        return res.status(200).json({ status: "Success", data: data })
    } catch (err: any) {
        return res.status(400).json({ status: "Failed", message: err.message })
    }
}
