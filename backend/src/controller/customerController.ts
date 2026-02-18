import { Request, Response } from 'express'
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



export const getAllCustomer = async (req: Request, res: Response) => {
    try {
        const customer = await getAllCustomerService()

        return res.status(200).json({ status: "Success", data: customer })
    } catch (err: any) {
        return res.status(400).json({ status: "Failed", message: err.message })
    }
}


export const createCustomer = async (req: Request<{}, {}, CreateCustomerInput>, res: Response) => {
    try {

        const { username, password, email, first_name, last_name, role, phone_num } = req.body

        if (!username || !password || !email || !first_name || !last_name || !phone_num) {
            return res.status(400).json({ status: "Error", message: "Missing required fields" })
        }

        const newCustomer = await createCustomerService(req.body)
        return res.status(201).json({ status: "Success", data: newCustomer })
    } catch (err: any) {
        return res.status(400).json({ status: "Error", messsage: err.message })
    }
}


export const getCustomerById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id)
        if (isNaN(id)) {
            return res.status(400).json({ status: "Error", message: "Invalid customer ID" })
        }

        const data = await getCustomerByIdService(id)
        if (!data) {
            return res.status(400).json({ status: "Error", message: "Not Found Customer" })
        }

        return res.status(200).json({ status: "Success", data: data })
    } catch (err: any) {
        return res.status(400).json({ status: "Failed", message: err.message })
    }
}


export const updateCustomerById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id)
        const { phone_num } = req.body
        console.log("body", req.body)
        console.log("phone", phone_num)

        if (!phone_num) {
            return res.status(400).json({ status: "Error", message: "Phone Number is required" })
        }
        const responese = await updateCustomerByIdService(id, { phone_num })

        if (!responese) {
            return res.status(400).json({ status: "Error", message: "Customer not found" })
        }

        return res.status(200).json({ status: "Success", data: responese })
    } catch (err: any) {
        return res.status(400).json({ status: "Failed", message: err.message })
    }
}

// ****************************** ADDRESS

export const addCustomerAddressById = async (req: Request<{ customerId: string; }, {}, AddCustomerAddressByIdInput>, res: Response) => {
    try {
        const customerId = Number(req.params.customerId)

        if (isNaN(customerId)) {
            return res.status(400).json({ status: "Failed", message: "Invalid customerId" })
        }
        const { address_line, country, province, district, subdistrict, postal_code, is_default } = req.body

        if (!address_line || !country || !province! || !district || !subdistrict || !postal_code) {
            return res.status(400).json({ status: "Error", message: "Missing required fields" })
        }

        const newAddress = await createCustomerAddressByIdService(customerId, req.body)
        return res.status(201).json({ status: "Success", data: newAddress })
    } catch (err: any) {
        return res.status(400).json({ status: "Failed", message: err.message })
    }
}


export const updateAddressCustomerById = async (req: Request<{ customerId: string; id: number }, {}, UpdateCustomerAddressInput>, res: Response) => {
    try {
        const customerId = Number(req.params.customerId)
        const id = Number(req.params.id)

        const updated = await updateAddressCustomerByIdService(customerId, id, req.body)

        if (!updated) {
            return res.status(400).json({ status: "Error", message: "Address not found" })
        }

        res.status(200).json({ status: "Success", data: updated })
    } catch (err: any) {
        return res.status(400).json({ status: "Failed", message: err.message })
    }
}