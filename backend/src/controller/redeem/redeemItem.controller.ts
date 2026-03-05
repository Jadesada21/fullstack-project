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

        const loginUserId = req.user!.id
        const role = req.user!.role

        const data = await getRedeemItemByUserIdService(redeemId, loginUserId, role)

        return res.status(200).json({ status: "Success", data: data })
    } catch (err) {
        next(err)
    }
}