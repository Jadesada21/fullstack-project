import { NextFunction, Request, Response } from 'express'
import { AppError } from '../../util/AppError'

import {
    getAllOrderService,
    createOrderService,
    updateStatusOrderService,
    getOrderByidService,
    getOrderByUserIdService
} from '../../service/order/order.service'


import { Status } from '../../types/order.type'


export const getAllOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getAllOrderService()
        return res.status(200).json({ status: "Success", data: data })
    } catch (err) {
        next(err)
    }
}

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const loginUserId = req.user!.id

        const data = await createOrderService(
            req.body,
            loginUserId
        )
        return res.status(201).json({ status: "Success", data: data })
    } catch (err) {
        next(err)
    }
}

export const updateStatusOrder = async (req: Request<{ id: string }, {}, { status: Status }>, res: Response, next: NextFunction) => {
    try {
        const orderId = Number(req.params.id)
        const { status } = req.body

        if (Number.isNaN(orderId)) {
            throw new AppError("Invalid orderid", 400)
        }

        if (!status) {
            throw new AppError("Status required", 400)
        }

        const data = await updateStatusOrderService(orderId, status, req.user)
        return res.status(200).json({ status: "Success", data: data })
    } catch (err) {
        next(err)
    }
}

export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orderId = Number(req.params.id)

        if (Number.isNaN(orderId)) {
            throw new AppError("Invalid order id", 400)
        }

        const loginUserId = req.user!.id
        const role = req.user!.role

        const data = await getOrderByidService(orderId, loginUserId, role)
        return res.status(200).json({ status: "Success", data: data })
    } catch (err) {
        next(err)
    }
}

export const getOrderByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const loginUserId = req.user!.id

        const data = await getOrderByUserIdService(loginUserId)
        return res.status(200).json({ status: "Success", data: data })
    } catch (err) {
        next(err)
    }
}