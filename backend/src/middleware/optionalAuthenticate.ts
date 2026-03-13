import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"
import { AppError } from "../util/AppError";

import { Role } from "../types/users.type";

interface JwtPayload {
    id: number
    role: Role
}

export const optionalAuthenticate = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token

        // guest 
        if (!token) {
            return next()
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as JwtPayload

        req.user = {
            id: decoded.id,
            role: decoded.role

        }


        next()
    } catch (err) {
        next(new AppError("Invalid token", 401))

    }
}