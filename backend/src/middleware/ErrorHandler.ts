import { Request, Response, NextFunction } from "express"
import { AppError } from "../util/AppError"

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {

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
