import { Request, Response, NextFunction } from "express"
import { AppError } from "../util/AppError"

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    }

    console.error(err)

    return res.status(500).json({
        status: "Error",
        message: "Internal server error"
    })
}
