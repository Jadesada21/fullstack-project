import { Request, Response } from 'express'

import {
    updateAddressCustomerByIdService,
    createCustomerAddressByIdService,
    getAllCustomerAddressService
} from '../service/addressService'

import {
    AddCustomerAddressByIdInput,
    UpdateCustomerAddressInput
} from '../types/address.type'


export const getAllCustomerAddress = async (req: Request, res: Response) => {
    try {
        const customer = await getAllCustomerAddressService()

        return res.status(200).json({ status: "Success", data: customer })
    } catch (err: any) {
        return res.status(400).json({ status: "Failed", message: err.message })
    }
}


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