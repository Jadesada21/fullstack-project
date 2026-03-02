import { NextFunction, Request, Response } from "express";
import { AppError } from "../../util/AppError";

import {
    getAllRedeemService,
    createRedeemService,
    updateStatusRedeemService,
    getRedeemByIdService,
    getRedeemByUserIdService
} from '../../service/redeem/redeem.service'

import { Status } from "../../types/redeem.type";

export const getAllRedeem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getAllRedeemService()
        return res.status(200).json({ status: "Success", data: data })
    } catch (err) {
        next(err)
    }

}

export const createRedeem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const loginUserId = req.user!.id

        const data = await createRedeemService(
            req.body,
            loginUserId
        )
        return res.status(201).json({ status: "Success", data: data })
    } catch (err) {
        next(err)
    }
}

export const updateStatusRedeem = async (req: Request<{ id: string }, {}, { status: Status }>, res: Response, next: NextFunction) => {
    try {
        const redeemId = Number(req.params.id)
        const { status } = req.body

        if (Number.isNaN(redeemId)) {
            throw new AppError("Invalid redeemId", 400)
        }

        if (!status) {
            throw new AppError("Status required", 400)
        }

        const data = await updateStatusRedeemService(redeemId, status, req.user)
        return res.status(200).json({ status: "Success", data: data })
    } catch (err) {
        next(err)
    }
}

export const getRedeemById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const redeemId = Number(req.params.id)

        if (Number.isNaN(redeemId)) {
            throw new AppError("Invalid redeem id", 400)
        }

        const loginUserId = req.user!.id
        const role = req.user!.role

        const data = await getRedeemByIdService(redeemId, loginUserId, role)
        return res.status(200).json({ status: "Success", data: data })
    } catch (err) {
        next(err)
    }
}

export const getRedeemByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = Number(req.params.id)

        if (Number.isNaN(userId) || userId < 0) {
            throw new AppError("Invalid user id ", 400)
        }

        const data = await getRedeemByUserIdService(userId)
        return res.status(200).json({ status: "Success", data: data })
    }
    catch (err) {
        next(err)
    }
}