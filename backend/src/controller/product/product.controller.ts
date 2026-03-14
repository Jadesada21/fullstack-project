import { NextFunction, Request, Response } from 'express'

import {
    getAllProductService,
    createProductService,
    getProductByIdService,
    toggleProductActiveService,
    restockProductByIdService,
    getAllRestockProductHisService
} from '../../service/product/product.service'

import {
    CreateProductInput,
    RoastLevel
} from '../../types/product/product.type'
import { AppError } from '../../util/AppError'



export const getAllProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const role = req.user?.role ?? 'guest'

        const price = req.query.price as string
        const roast_level = req.query.roast_level as string

        const page = Number(req.query.page) || 1

        const data = await getAllProductService({ role, price, roast_level, page })
        return res.status(200).json({ data })
    } catch (err) {
        next(err)
    }
}

export const createProduct = async (req: Request<{}, {}, CreateProductInput>, res: Response, next: NextFunction) => {
    try {
        const { name, description, taste, roast_level, bag_size, price, stock, reward_points, category_id } = req.body

        if (
            name == null ||
            description == null ||
            taste == null ||
            roast_level == null ||
            bag_size == null ||
            price == null ||
            stock == null ||
            reward_points == null ||
            category_id == null
        ) {
            throw new AppError("Missing required field", 400)
        }

        if (
            typeof name !== "string" || name.trim() === "" ||
            typeof description !== "string" || description.trim() === "" ||
            typeof taste !== "string" || taste.trim() === "" ||
            typeof bag_size !== "string" || bag_size.trim() === "" ||
            typeof price !== "number" || price <= 0 ||
            typeof stock !== "number" || !Number.isInteger(stock) || stock < 0 ||
            typeof reward_points !== "number" || !Number.isInteger(reward_points) || reward_points <= 0 ||
            typeof category_id !== "number" || !Number.isInteger(category_id) || category_id <= 0
        ) {
            throw new AppError("Invalid input", 400)
        }

        const validRoastLevels: RoastLevel[] = ['light', 'medium', 'dark']

        if (!validRoastLevels.includes(roast_level)) {
            throw new AppError("Invalid Roast Level", 400)
        }
        const newProduct = await createProductService(req.body)
        return res.status(201).json({ newProduct })

    } catch (err) {
        next(err)
    }
}

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const role = req.user?.role ?? 'guest'

        const id = Number(req.params.id)
        if (Number.isNaN(id)) {
            throw new AppError("Invalid product ID", 400)
        }

        const data = await getProductByIdService(id, role)
        return res.status(200).json({ data })

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
        return res.status(200).json({ data })

    } catch (err) {
        next(err)
    }
}

export const restockProductByid = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params
        const { quantity } = req.body

        const productId = Number(id)

        if (isNaN(Number(productId))) {
            throw new AppError("Invalid product id", 400)
        }

        const data = await restockProductByIdService(productId, quantity)
        res.status(200).json({ data })

    } catch (err) {
        next(err)
    }
}

export const getAllRestockProductHis = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params

        const productId = Number(id)

        if (Number.isNaN(productId)) {
            throw new AppError("Invalid product id ", 400)
        }

        const data = await getAllRestockProductHisService(productId)

        res.status(200).json({ data })
    } catch (err) {
        next(err)
    }
}