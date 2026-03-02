import { NextFunction, Request, Response } from 'express'
import { AppError } from '../../util/AppError'

import {
    getRedeemItemByUserIdService
} from '../../service/redeem/redeemItem.service'


export const getRedeemItemByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const redeemId = Number(req.params.redeemId)

        if (Number.isNaN(redeemId)) {
            throw new AppError("Invalid redeem id", 400)
        }

        if (!req.user) {
            throw new AppError("Unauthorized", 401)
        }

        const { id: userId, role } = req.user

        const data = await getRedeemItemByUserIdService(redeemId, userId, role)

        return res.status(200).json({ status: "Success", data: data })
    } catch (err) {
        next(err)
    }
}