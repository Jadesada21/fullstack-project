import { Request, Response, NextFunction } from "express"
import { AppError } from "../util/AppError"
import { DB_CONSTRAINT_EXISTING } from "../constants/statusCode"

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {

    if (err.code === '23505') {
        if (err.constraint === DB_CONSTRAINT_EXISTING.USER_EMAIL) {
            err = new AppError("Email already exists", 400)
        }

        if (err.constraint === DB_CONSTRAINT_EXISTING.USER_USERNAME) {
            err = new AppError("Username already exists", 400)
        }
    }

    const statusCode = err instanceof AppError ? err.statusCode : 500
    const message = err instanceof AppError ? err.message : "Internal server error"

    if (!(err instanceof AppError)) {
        console.error(err)
    }


    return res.status(statusCode).json({
        statusCode,
        message
    })
}
