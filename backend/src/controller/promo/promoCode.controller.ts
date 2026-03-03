import { NextFunction, Request, Response } from 'express'

import {
    getAllPromoCodeService,
    createPromoCodeService,
    getPromoCodeByIdService,
    togglePromoCodeActiveService
} from '../../service/promo/promoCode.service'

import {
    PromoCodeTypeInput
} from '../../types/promo.type'
import { AppError } from '../../util/AppError'



export const getAllPromoCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getAllPromoCodeService()
        return res.status(200).json({ status: "Success", data: data })
    } catch (err) {
        next(err)
    }
}

export const createPromoCode = async (req: Request<{}, {}, PromoCodeTypeInput>, res: Response, next: NextFunction) => {
    try {
        const { code, points, max_usage } = req.body

        if (
            code === undefined ||
            points === undefined ||
            max_usage === undefined
        ) {
            throw new AppError("Missing required field", 400)
        }

        if (
            typeof code !== "string" ||
            code.trim() === "" ||

            typeof points !== "number" || Number.isInteger(points) ||
            points <= 0 ||

            typeof max_usage !== "number" || Number.isInteger(max_usage) ||
            max_usage <= 0
        ) {
            throw new AppError("Invalid input", 400)
        }

        const newPromoCode = await createPromoCodeService(req.body)
        return res.status(201).json({ status: "Success", data: newPromoCode })

    } catch (err) {
        next(err)
    }
}

export const getPromoCodeById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id)
        if (Number.isNaN(id)) {
            throw new AppError("Invalid product ID", 400)
        }

        const data = await getPromoCodeByIdService(id)
        return res.status(200).json({ status: "Success", data: data })

    } catch (err) {
        next(err)
    }
}

export const togglePromoCodeActive = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id)
        if (Number.isNaN(id)) {
            throw new AppError("Invalid Promo Code id", 400)
        }
        const data = await togglePromoCodeActiveService(id)
        return res.status(200).json({ status: "Success", data: data })

    } catch (err) {
        next(err)
    }
}