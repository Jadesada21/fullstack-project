import { NextFunction, Request, Response } from "express";
import { AppError } from "../../util/AppError";

import {
    uploadImageProductByIdService,
    getImageProductByIdService,
    updatePrimaryImagesByIdService,
    updateSortOrderByIdService,
    deleteProductImagesByIdService
} from '../../service/product/image.Service'

import {
    UploadImageBody,
} from '../../types/product/image.type'


export const uploadImageByProductId = async (req: Request<{ product_id: string }, {}, UploadImageBody>, res: Response, next: NextFunction) => {
    try {
        const product_id = Number(req.params.product_id)

        if (!product_id) {
            return res.status(400).json({ status: "Failed", message: "Invalid product_id" })
        }

        const images = req.body.images

        const result = await uploadImageProductByIdService(product_id, images)
        return res.status(201).json({ status: "Success", data: result })
    } catch (err) {
        next(err)

    }
}

export const getImageById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id)

        if (isNaN(id)) {
            throw new AppError("Invalid Product_images Id", 400)
        }

        const data = await getImageProductByIdService(id)
        return res.status(200).json({ status: "Success", data: data })
    } catch (err) {
        next(err)

    }
}

export const updatePrimaryImagesByProductId = async (req: Request<{ product_id: string }, {}, { image_id: number }>, res: Response, next: NextFunction) => {
    try {
        const product_id = Number(req.params.product_id)

        if (!product_id) {
            return res.status(400).json({ status: "Failed", message: "Invalid product_id" })
        }

        const { image_id } = req.body

        if (!image_id) {
            return res.status(400).json({ status: "Failed", message: "image_id is required" })
        }

        const data = await updatePrimaryImagesByIdService(product_id, { image_id })
        return res.status(200).json({ status: "Success", data: data })
    } catch (err) {
        next(err)
    }
}

export const updateSortOrderByProductId = async (req: Request<{ product_id: string }, {}, { image_ids: number[] }>, res: Response, next: NextFunction) => {
    try {
        const product_id = Number(req.params.product_id)

        if (!product_id) {
            return res.status(400).json({ status: "Failed", message: "Invalid product_id" })
        }

        const { image_ids } = req.body

        if (!image_ids || image_ids.length === 0) {
            return res.status(400).json({ status: "Failed", message: "Image_ids are required" })
        }

        await updateSortOrderByIdService(product_id, { image_ids })
        return res.status(200).json({ status: "Success", message: "Sort Order Successfully" })
    } catch (err) {
        next(err)

    }
}

export const deleteProductImagesByProductId = async (req: Request<{ product_id: string }, {}, { image_ids: number[] }>, res: Response, next: NextFunction) => {
    try {
        const product_id = Number(req.params.product_id)

        if (!product_id) {
            return res.status(400).json({ status: "Failed", message: "Invalid product_id" })
        }

        const { image_ids } = req.body
        if (!image_ids || image_ids.length === 0) {
            return res.status(400).json({ status: "Failed", message: "Image_ids are required" })
        }

        const data = await deleteProductImagesByIdService(product_id, { image_ids })
        return res.status(200).json({
            status: "Success",
            message: "Images deleted successfully",
            data
        })
    } catch (err) {
        next(err)

    }
}
