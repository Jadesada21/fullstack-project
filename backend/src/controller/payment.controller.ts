import { NextFunction, Request, Response } from "express";
import { AppError } from "../util/AppError";


import {
    getAllPaymentService,
    createPaymentService,
    updatePaymentStatusService,
    getPaymentByIdService
} from '../service/payment.service'

import { PaymentUpdateStatus } from "../types/payment.type";


export const getAllPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getAllPaymentService()
        return res.status(200).json({ status: "Success", data })
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
        return res.status(201).json({ status: "Success", payment })
    } catch (err) {
        next(err)
    }
}


export const updatePaymentStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const paymentId = Number(req.params.paymentId)
        const loginUserId = Number(req.user!.id)
        const role = req.user!.role

        if (Number.isNaN(paymentId)) {
            throw new AppError("Invalid payment id", 400)
        }

        const { status } = req.body

        const allowedStatuses: PaymentUpdateStatus[] = ["completed", "cancelled"]

        if (!allowedStatuses.includes(status)) {
            throw new AppError("Invalid payment status", 400)
        }

        if (!['completed', 'failed'].includes(status)) {
            throw new AppError("Invalid payment status", 400)
        }

        const data = await updatePaymentStatusService(paymentId, status, loginUserId, role)
        return res.status(200).json({ status: "Success", data })
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
        return res.status(200).json({ status: "Success", data })
    } catch (err) {
        next(err)
    }
}