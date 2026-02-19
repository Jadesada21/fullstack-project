import { NextFunction, Request, Response } from 'express'
import { verifyToken } from "../util/jwt"
import { AppError } from '../util/AppError'


export const authenticate = (req: Request, res: Response, next: NextFunction) => {

    const token = req.cookies?.token

    if (!token) {
        return next(new AppError("Invalid token", 401))
    }

    try {
        const decoded = verifyToken(token)
        req.user = decoded as any
        next()
    } catch (err) {
        return next(new AppError("Invalid token", 401))
    }
}

//     const authHeader = req.headers.authorization
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//         return next(new AppError("Unauthorized", 401))
//     }

//     const token = authHeader.split(" ")[1]
//     if (!token) {
//         return res.status(401).json({ message: "Token missing" })
//     }

//     try {
//         const decoded = verifyToken(token)
//         req.user = decoded as any
//         next()
//     } catch (err) {
//         return next(new AppError("Invalid token", 401))
//     }
// }
