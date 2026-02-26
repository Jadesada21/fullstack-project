import { NextFunction, Request, Response } from "express";
import { AppError } from "../../util/AppError";

import {
    uploadImageRewardByIdService,
    getImageRewardByIdService,
    updatePrimaryImagesByIdService,
    updateSortOrderByIdService,
    deleteRewardImagesByIdService
} from '../../service/reward/image.Service'


export const uploadImageByRewardId = async (
    req: Request<{ reward_id: string }, {}, { imageMeta?: string }>,
    res: Response,
    next: NextFunction) => {
    try {
        const reward_id = Number(req.params.reward_id)

        if (!reward_id) {
            return res.status(400).json({ status: "Failed", message: "Invalid reward_id" })
        }

        const files = req.files as Express.Multer.File[]

        let imagesMeta = []
        if (req.body.imageMeta) {
            try {
                imagesMeta = JSON.parse(req.body.imageMeta)
            } catch (err) {
                return res.status(400).json({ status: "Failed", message: "imagesMeta must be valid JSON" })
            }
        }


        const data = await uploadImageRewardByIdService(
            reward_id, files, imagesMeta)
        return res.status(201).json({ status: "Success", data: data })
    } catch (err) {
        next(err)

    }
}

export const getImageById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id)

        if (isNaN(id)) {
            throw new AppError("Invalid Reward_images Id", 400)
        }

        const data = await getImageRewardByIdService(id)
        return res.status(200).json({ status: "Success", data: data })
    } catch (err) {
        next(err)

    }
}

export const updatePrimaryImagesByRewardId = async (req: Request<{ reward_id: string }, {}, { image_id: number }>, res: Response, next: NextFunction) => {
    try {
        const reward_id = Number(req.params.reward_id)

        if (!reward_id) {
            return res.status(400).json({ status: "Failed", message: "Invalid reward_id" })
        }

        const { image_id } = req.body

        if (!image_id) {
            return res.status(400).json({ status: "Failed", message: "image_id is required" })
        }

        const data = await updatePrimaryImagesByIdService(reward_id, { image_id })
        return res.status(200).json({ status: "Success", data: data })
    } catch (err) {
        next(err)
    }
}

export const updateSortOrderByRewardId = async (req: Request<{ reward_id: string }, {}, { image_ids: number[] }>, res: Response, next: NextFunction) => {
    try {
        const reward_id = Number(req.params.reward_id)

        if (!reward_id) {
            return res.status(400).json({ status: "Failed", message: "Invalid reward_id" })
        }

        const { image_ids } = req.body

        if (!image_ids || image_ids.length === 0) {
            return res.status(400).json({ status: "Failed", message: "Image_ids are required" })
        }

        await updateSortOrderByIdService(reward_id, { image_ids })
        return res.status(200).json({ status: "Success", message: "Sort Order Successfully" })
    } catch (err) {
        next(err)

    }
}

export const deleteRewardImagesByRewardId = async (req: Request<{ reward_id: string }, {}, { image_ids: number[] }>, res: Response, next: NextFunction) => {
    try {
        const reward_id = parseInt(req.params.reward_id, 10)

        if (!isNaN(reward_id)) {
            return res.status(400).json({ status: "Failed", message: "Invalid reward_id" })
        }

        const { image_ids } = req.body
        if (
            !Array.isArray(image_ids) ||
            image_ids.length === 0 ||
            image_ids.some(id => typeof id !== "number")
        ) {
            return res.status(400).json({ status: "Failed", message: "Valid image_ids array is required" })
        }

        const data = await deleteRewardImagesByIdService(reward_id, { image_ids })
        return res.status(200).json({
            status: "Success",
            message: "Images deleted successfully",
            data
        })
    } catch (err) {
        next(err)
    }
}
