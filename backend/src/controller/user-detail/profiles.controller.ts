import { NextFunction, Request, Response } from 'express'
import {
    getAllPaymentByLoginUserService,
    getProfileByLoginUserService,
} from '../../service/user-details/profiles.service'


export const getUserByLoginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const loginUserId = req.user!.id

        const user = await getProfileByLoginUserService(loginUserId)
        return res.status(200).json({ status: "Success", user })
    } catch (err) {
        next(err)
    }
}

export const getAllPaymentByLoginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const loginUserId = req.user!.id

        const payment = await getAllPaymentByLoginUserService(loginUserId)
        return res.status(200).json({ status: "Success", payment })
    } catch (err) {
        next(err)
    }
}

