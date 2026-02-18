import { NextFunction, Request, Response } from 'express'

import {
    getAllCustomerAddressService
} from '../service/addressService'


export const getAllCustomerAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const customer = await getAllCustomerAddressService()

        return res.status(200).json({ status: "Success", data: customer })
    } catch (err) {
        next(err)
    }
}


