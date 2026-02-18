import { NextFunction, Request, Response } from 'express'
import {
    getAllCustomerService,
    createCustomerService,
    getCustomerByIdService,
    updateCustomerByIdService,
    updateAddressCustomerByIdService,
    createCustomerAddressByIdService,
} from '../service/customerService'

import {
    CreateCustomerInput,
} from '../types/customer.type'


import {
    AddCustomerAddressByIdInput,
    UpdateCustomerAddressInput
} from '../types/address.type'
import { AppError } from '../util/AppError'



export const getAllCustomer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const customer = await getAllCustomerService()

        return res.status(200).json({ status: "Success", data: customer })
    } catch (err) {
        next(err)
    }
}


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


export const getCustomerById = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const id = Number(req.params.id)
        if (isNaN(id)) {
            throw new AppError("Invalid customer ID", 400)
        }

        const data = await getCustomerByIdService(id)

        return res.status(200).json({ status: "Success", data: data })
    } catch (err) {
        next(err)
    }
}


export const updateCustomerById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id)
        if (isNaN(id)) {
            throw new AppError("Invalid customer ID", 400)
        }

        const { phone_num } = req.body
        if (!phone_num) {
            throw new AppError("Phone Number is required", 400)
        }
        const responese = await updateCustomerByIdService(id, { phone_num })

        return res.status(200).json({ status: "Success", data: responese })
    } catch (err) {
        next(err)
    }
}

// ****************************** ADDRESS

export const addCustomerAddressById = async (req: Request<{ customerId: string; }, {}, AddCustomerAddressByIdInput>, res: Response, next: NextFunction) => {
    try {
        const customerId = Number(req.params.customerId)

        if (isNaN(customerId)) {
            throw new AppError("Invalid customerId", 400)
        }

        const { address_line, country, province, district, subdistrict, postal_code, is_default } = req.body
        if (!address_line || !country || !province || !district || !subdistrict || !postal_code) {
            throw new AppError("Missing required field", 400)
        }

        const newAddress = await createCustomerAddressByIdService(customerId, req.body)
        return res.status(201).json({ status: "Success", data: newAddress })
    } catch (err) {
        next(err)
    }
}


export const updateAddressCustomerById = async (req: Request<{ customerId: string; id: number }, {}, UpdateCustomerAddressInput>, res: Response, next: NextFunction) => {
    try {
        const customerId = Number(req.params.customerId)
        const id = Number(req.params.id)

        const updated = await updateAddressCustomerByIdService(customerId, id, req.body)

        res.status(200).json({ status: "Success", data: updated })
    } catch (err) {
        next(err)
    }
}