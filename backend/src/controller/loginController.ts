import { NextFunction, Request, Response } from "express";
import { AppError } from "../util/AppError";

import {
    loginService
} from '../service/loginService'



export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, password } = req.body

        if (!username || !password) {
            throw new AppError("Username or password are required", 400)
        }

        const { token, user } = await loginService(username, password)


        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 24 * 60 * 60 * 1000
        })

        return res.status(200).json({ status: "Success", data: user })
    } catch (err) {
        next(err)
    }
}