import { Request, Response, NextFunction } from "express";

import {
    getAllStockmovementService,
    getStockmovementByIdService
} from '../service/stockmove.service'
import { AppError } from "../util/AppError";


export const getAllStockmovement = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getAllStockmovementService()
        return res.status(200).json({ status: "Success", data: data })
    } catch (err) {
        next(err)
    }
}

export const getStockmovementById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id)

        if (Number.isNaN(id)) {
            throw new AppError("Invalid id ", 400)
        }

        const data = await getStockmovementByIdService(id)
        return res.status(200).json({ status: "Success", data: data })
    } catch (err) {
        next(err)
    }
}