import { NextFunction, Request, Response } from "express";
import { AppError } from "../util/AppError";

import {
    getAllPointsHistoryService,
    getPointsHistoryByUserIdService
} from '../service/pointHistory.service'

export const getAllPointsHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.userId
            ? Number(req.query.userId)
            : undefined

        const limit = req.query.limit
            ? Number(req.query.limit)
            : 20

        if (userId && isNaN(userId)) {
            throw new AppError("Invalid UserId", 400)
        }

        if (isNaN(limit)) {
            throw new AppError("Invalid limit", 400)
        }

        const data = await getAllPointsHistoryService(userId, limit)
        return res.status(200).json({ status: "Success", total: data.length, data })

    } catch (err) {
        next(err)
    }
}

export const getPointsHistoryByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = Number(req.params.userId)

        const limit = req.query.limit
            ? Number(req.query.limit)
            : 10

        if (isNaN(userId)) {
            throw new AppError("Invalid UserId", 400)
        }

        if (isNaN(limit)) {
            throw new AppError("Invalid limit", 400)
        }

        const data = await getPointsHistoryByUserIdService(userId, limit)
        return res.status(200).json({ status: "Success", total: data.length, data })
    } catch (err) {
        next(err)
    }
}