import { NextFunction, Request, Response } from 'express'
import { AppError } from '../util/AppError'

import { CreateCustomerInput } from "../types/customer.type"


import { createCustomerService } from '../service/register.service'


export const createCustomer = async (req: Request<{}, {}, CreateCustomerInput>, res: Response, next: NextFunction) => {
    try {

        const { username, password, email, first_name, last_name, role, phone_num } = req.body

        if (!username || !password || !email || !first_name || !last_name || !phone_num) {
            throw new AppError("Missing required field", 400)
        }

        const newCustomer = await createCustomerService(req.body)
        return res.status(201).json({ status: "Success", data: newCustomer })

    } catch (err) {
        next(err)
    }
}