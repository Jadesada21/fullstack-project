import { NextFunction, Request, Response } from 'express'
import { getMeRefreshService } from '../service/getMeRefresh.service'


export const getMeRefresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const loginUserId = req.user!.id

        const user = await getMeRefreshService(loginUserId)
        return res.status(200).json({ status: "Success", user })
    } catch (err) {
        next(err)
    }
}