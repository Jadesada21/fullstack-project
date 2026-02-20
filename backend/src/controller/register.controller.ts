import { NextFunction, Request, Response } from 'express'
import { AppError } from '../util/AppError'

import { CreateUsersInput } from "../types/users.type"


import { createUsersService } from '../service/register.service'


export const createUsers = async (req: Request<{}, {}, CreateUsersInput>, res: Response, next: NextFunction) => {
    try {

        const { username, password, email, first_name, last_name, role, phone_num } = req.body

        if (!username || !password || !email || !first_name || !last_name || !phone_num) {
            throw new AppError("Missing required field", 400)
        }

        const newCustomer = await createUsersService(req.body)
        return res.status(201).json({ status: "Success", data: newCustomer })

    } catch (err) {
        next(err)
    }
}