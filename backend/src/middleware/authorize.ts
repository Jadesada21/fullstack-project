import { NextFunction, Request, Response } from 'express'
import { AppError } from '../util/AppError'


export const authorize = (...roles: ('admin' | 'customer')[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new AppError("Forbidden", 403))
        }
        next()
    }
}