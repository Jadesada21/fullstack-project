import { NextFunction, Request, Response } from 'express'
import { AppError } from '../../util/AppError'

import {
    getOrderItemByUserIdService
} from '../../service/order/orderItems.service'


export const getOrderItemByOrderIdandUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orderId = Number(req.params.orderId)

        if (Number.isNaN(orderId)) {
            throw new AppError("Invalid order id", 400)
        }

        if (!req.user) {
            throw new AppError("Unauthorized", 401)
        }

        const { id: userId, role } = req.user

        const data = await getOrderItemByUserIdService(orderId, userId, role)

        return res.status(200).json({ status: "Success", data: data })
    } catch (err) {
        next(err)
    }
}