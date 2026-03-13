import { NextFunction, Request, Response } from "express";
import { AppError } from "../../util/AppError";

import {
    getAllRedeemService,
    createRedeemService,
    updateStatusRedeemService,
    getAllRedeemsByLoginUserService,
    getRedeemByIdByLoginUserService,
    adminGetRedeemByIdService
} from '../../service/redeem/redeem.service'

import { RedeemUpdateStatus } from "../../types/redeem.type";

export const getAllRedeem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getAllRedeemService()
        return res.status(200).json({ data })
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
        return res.status(201).json({ data })
    } catch (err) {
        next(err)
    }
}

export const updateStatusRedeem = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const redeemId = Number(req.params.id)
        const loginUserId = Number(req.user!.id)
        const role = req.user!.role


        if (Number.isNaN(redeemId)) {
            throw new AppError("Invalid redeemId", 400)
        }

        const { status } = req.body

        const allowedStatuses: RedeemUpdateStatus[] = ["completed", "failed"]

        if (!allowedStatuses.includes(status)) {
            throw new AppError("Invalid redeem status", 400)
        }

        if (!['completed', 'failed'].includes(status)) {
            throw new AppError("Invalid redeem status", 400)
        }

        const data = await updateStatusRedeemService(redeemId, status, loginUserId, role)
        return res.status(200).json({ data })
    } catch (err) {
        next(err)
    }
}


export const getAllRedeemsByLoginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const loginUserId = req.user!.id

        const data = await getAllRedeemsByLoginUserService(loginUserId)
        return res.status(200).json({ data })
    }
    catch (err) {
        next(err)
    }
}

export const getRedeemsByIdByLoginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const redeemId = Number(req.params.id)
        const loginUserId = req.user!.id

        if (Number.isNaN(redeemId)) {
            throw new AppError("Redeem not found", 400)
        }

        const data = await getRedeemByIdByLoginUserService(redeemId, loginUserId)
        return res.status(200).json({ status: "Success", data })
    } catch (err) {
        next(err)
    }
}


export const adminGetRedeemById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const redeemId = Number(req.params.id)

        if (Number.isNaN(redeemId)) {
            throw new AppError("Invalid redeem id", 400)
        }

        const data = await adminGetRedeemByIdService(redeemId)
        return res.status(200).json({ status: "Success", data })
    } catch (err) {
        next(err)
    }
}