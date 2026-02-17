import { Request, Response } from 'express'

import {
    getAllProductService,
    createProductService
} from '../service/productService'

import {
    CreateProductInput
} from '../types/product.type'

export const getAllProduct = async (req: Request, res: Response) => {
    try {
        const product = await getAllProductService()
        return res.status(200).json({ status: "Success", data: product })
    } catch (err: any) {
        return res.status(400).json({ status: "Failed", message: err.message })

    }
}

export const createProduct = async (req: Request<{}, {}, CreateProductInput>, res: Response) => {
    try {
        const { name, description, short_description, price, stock, category_id, roast_level } = req.body

        if (!name || !short_description || !description || !price || !stock || !category_id || !roast_level) {
            return res.status(400).json({ status: "Error", message: "Missing required fields" })
        }

        const newProduct = await createProductService(req.body)
        return res.status(201).json({ status: "Success", data: newProduct })

    } catch (err: any) {
        return res.status(401).json({ status: "Failed", message: err.message })
    }
}