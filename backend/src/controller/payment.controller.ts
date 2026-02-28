import { NextFunction, Request, Response } from "express";
import { AppError } from "../util/AppError";


import {
    getAllPaymentService,
    createPaymentService,
    comfirmPaymentService,
    cancelledPaymentService,
    getPaymentByIdService
} from '../service/payment.service'


export const getAllPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getAllPaymentService()
        return res.status(200).json({ status: "Success", data: data })
    } catch (err) {
        next(err)
    }
}

export const createPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orderId = Number(req.params.orderId)

        if (!orderId || isNaN(orderId)) {
            throw new AppError("Invalid orderId", 400)
        }

        const userId = req.user!.id

        const payment = await createPaymentService(orderId, userId)
        return res.status(201).json({ status: "Success", data: payment })
    } catch (err) {
        next(err)
    }
}

export const comfirmPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const paymentId = Number(req.params.paymentId)

        const loginUserId = req.user!.id

        const data = await comfirmPaymentService(paymentId, loginUserId)
        return res.status(200).json({ status: "Success", data: data })
    } catch (err) {
        next(err)
    }
}

export const cancelledPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const paymentId = Number(req.params.paymentId)

        const loginUserId = req.user!.id

        const data = await cancelledPaymentService(paymentId, loginUserId)
        return res.status(200).json({ status: "Success", data: data })
    } catch (err) {
        next(err)
    }
}

export const getPaymentById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const paymentId = Number(req.params.paymentId)

        if (!paymentId || isNaN(paymentId)) {
            throw new AppError("Invalid paymentId", 400)
        }

        const data = await getPaymentByIdService(paymentId, req.user!.id, req.user!.role)
        return res.status(200).json({ status: "Success", data: data })
    } catch (err) {
        next(err)
    }
}