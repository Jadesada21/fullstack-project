import { NextFunction, Request, Response } from 'express'
import { AppError } from '../util/AppError'
import { Role } from '../types/users.type'


export const authorize = (...roles: Role[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new AppError("Forbidden", 403))
        }
        next()
    }
}