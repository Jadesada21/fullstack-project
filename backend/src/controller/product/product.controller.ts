import { NextFunction, Request, Response } from 'express'

import {
    getAllProductService,
    createProductService,
    getProductByIdService,
    toggleProductActiveService
} from '../../service/product/product.service'

import {
    CreateProductInput,
    RoastLevel
} from '../../types/product/product.type'
import { AppError } from '../../util/AppError'



export const getAllProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const role = req.user?.role ?? 'guest'
        const data = await getAllProductService(role)
        return res.status(200).json({ status: "Success", data: data })
    } catch (err) {
        next(err)
    }
}

export const createProduct = async (req: Request<{}, {}, CreateProductInput>, res: Response, next: NextFunction) => {
    try {
        const { name, description, short_description, price, stock, reward_points, category_id, roast_level } = req.body

        if (
            name === undefined ||
            description === undefined ||
            short_description === undefined ||
            price === undefined ||
            stock === undefined ||
            reward_points === undefined ||
            category_id === undefined ||
            roast_level === undefined
        ) {
            throw new AppError("Missing required field", 400)
        }

        if (
            typeof name !== "string" || name.trim() === "" ||
            typeof short_description !== "string" || short_description.trim() === "" ||
            typeof description !== "string" || description.trim() === "" ||
            typeof price !== "number" || Number.isInteger(price) || price <= 0 ||
            typeof stock !== "number" || Number.isInteger(stock) || stock < 0 ||
            typeof reward_points !== "number" || Number.isInteger(reward_points) || reward_points < 0 ||
            typeof category_id !== "number" || Number.isInteger(category_id) ||
        ) {
            throw new AppError("Invalid input", 400)
        }

        const validRoastLevels: RoastLevel[] = ['light', 'medium', 'dark']

        if (!validRoastLevels.includes(roast_level)) {
            throw new AppError("Invalid Roast Level", 400)
        }
        const newProduct = await createProductService(req.body)
        return res.status(201).json({ status: "Success", data: newProduct })

    } catch (err) {
        next(err)
    }
}

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id)
        if (Number.isNaN(id)) {
            throw new AppError("Invalid product ID", 400)
        }

        const data = await getProductByIdService(id)
        return res.status(200).json({ status: "Success", data: data })

    } catch (err) {
        next(err)
    }
}

export const toggleProductActive = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id)
        if (Number.isNaN(id)) {
            throw new AppError("Invalid product ID", 400)
        }
        const data = await toggleProductActiveService(id)
        return res.status(200).json({ status: "Success", data: data })

    } catch (err) {
        next(err)
    }
}