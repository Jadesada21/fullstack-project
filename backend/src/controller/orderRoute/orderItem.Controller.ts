import { NextFunction, Request, Response } from 'express'
import { AppError } from '../../util/AppError'

import {
    getOrderItemByOrderIdService
} from '../../service/order/orderItems.service'


export const getOrderItemByOrderId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orderId = Number(req.params.orderId)

        if (Number.isNaN(orderId)) {
            return res.status(400).json({ status: "Failed", message: "Invalid order id" })
        }

        if (!req.user) {
            return res.sendStatus(401)
        }

        const { id: userId, role } = req.user

        const data = await getOrderItemByOrderIdService(userId, orderId, role)

        return res.status(200).json({ status: "Success", data: data })
    } catch (err) {
        next(err)
    }
}