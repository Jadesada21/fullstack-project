import { NextFunction, Request, Response } from 'express'

import {
    getAllRewardService,
    createRewardService,
    getRewardByIdService,
    toggleRewardActiveService
} from '../../service/reward/reward.service'

import {
    CreateRewardInput,
} from '../../types/reward/reward.type'

import { AppError } from '../../util/AppError'



export const getAllReward = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const role = req.user?.role

        const data = await getAllRewardService(role)
        return res.status(200).json({ status: "Success", data: data })
    } catch (err) {
        next(err)
    }
}

export const createReward = async (req: Request<{}, {}, CreateRewardInput>, res: Response, next: NextFunction) => {
    try {
        const { name, short_description, description, stock, points_required, category_id } = req.body

        if (
            name === undefined ||
            short_description === undefined ||
            description === undefined ||
            points_required === undefined ||
            stock === undefined ||
            category_id === undefined
        ) {
            throw new AppError("Missing required field", 400)
        }

        if (
            typeof name !== "string" || name.trim() === "" ||
            typeof short_description !== "string" || short_description.trim() === "" ||
            typeof description !== "string" || description.trim() === "" ||
            typeof points_required !== "number" || Number.isInteger(points_required) || points_required <= 0 ||
            typeof stock !== "number" || Number.isInteger(stock) || stock < 0 ||
            typeof category_id !== "number" || Number.isInteger(category_id)
        ) {
            throw new AppError("Invalid input ", 400)
        }

        const data = await createRewardService(req.body)
        return res.status(201).json({ status: "Success", data: data })

    } catch (err) {
        next(err)
    }
}

export const getRewardById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id)
        if (isNaN(id)) {
            throw new AppError("Invalid reward ID", 400)
        }

        const data = await getRewardByIdService(id)
        return res.status(200).json({ status: "Success", data: data })

    } catch (err) {
        next(err)
    }
}

export const toggleRewardActive = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id)
        if (isNaN(id)) {
            throw new AppError("Invalid reward ID", 400)
        }
        const data = await toggleRewardActiveService(id)
        return res.status(200).json({ status: "Success", data: data })

    } catch (err) {
        next(err)
    }
}