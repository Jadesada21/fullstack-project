import { NextFunction, Request, Response } from 'express'

import {
    getAllCategoryService,
    createCategoryService,
    getCategoryByIdService,
    getCategoryProductsByIdService,
    getCategoryRewardsByIdService
} from '../service/category.service'

import {
    CreateCategoryInput
} from '../types/category.type'
import { AppError } from '../util/AppError'

export const getAllCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const category = await getAllCategoryService()
        return res.status(200).json({ status: "Success", data: category })
    } catch (err) {
        next(err)
    }
}


export const createCategory = async (req: Request<{}, {}, CreateCategoryInput>, res: Response, next: NextFunction) => {
    try {
        const Newcategory = await createCategoryService(req.body)
        return res.status(201).json({ status: "Success", data: Newcategory })
    } catch (err) {
        next(err)
    }
}

export const getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id)

        if (isNaN(id)) {
            throw new AppError("Invalid categories Id", 400)
        }

        const data = await getCategoryByIdService(id)

        return res.status(200).json({ status: "Success", data: data })
    } catch (err) {
        next(err)
    }
}


export const getCategoryProductsById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id)

        if (isNaN(id)) {
            throw new AppError("Invalid categories Id", 400)
        }
        const data = await getCategoryProductsByIdService(id)

        return res.status(200).json({ status: "Success", data: data })
    } catch (err) {
        next(err)
    }
}



export const getCategoryRewardsById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id)

        if (isNaN(id)) {
            throw new AppError("Invalid categories Id", 400)
        }

        const data = await getCategoryRewardsByIdService(id)

        return res.status(200).json({ status: "Success", data: data })
    } catch (err) {
        next(err)
    }
}