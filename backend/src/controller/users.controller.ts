import { NextFunction, Request, Response } from 'express'
import {
    getAllUsersService,
    getUsersByIdService,
    updateUsersByIdService,
    getAllUsersAddressService,
    createUsersAddressByIdService,
    updateAddressUserByIdService,
} from '../service/users.service'



import {
    AddUsersAddressByIdInput,
    UpdateUsersAddressInput
} from '../types/address.type'

import { AppError } from '../util/AppError'



export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await getAllUsersService()

        return res.status(200).json({ status: "Success", data: user })
    } catch (err) {
        next(err)
    }
}





export const getUsersById = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const id = Number(req.params.id)
        if (isNaN(id)) {
            throw new AppError("Invalid user ID", 400)
        }

        const data = await getUsersByIdService(id)

        return res.status(200).json({ status: "Success", data: data })
    } catch (err) {
        next(err)
    }
}


export const updateUsersById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id)
        if (isNaN(id)) {
            throw new AppError("Invalid user ID", 400)
        }

        const { phone_num } = req.body
        if (!phone_num) {
            throw new AppError("Phone Number is required", 400)
        }
        const responese = await updateUsersByIdService(id, { phone_num })

        return res.status(200).json({ status: "Success", data: responese })
    } catch (err) {
        next(err)
    }
}

// ****************************** ADDRESS



export const getAllUsersAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await getAllUsersAddressService()

        return res.status(200).json({ status: "Success", data: user })
    } catch (err) {
        next(err)
    }
}


export const addUsersAddressById = async (req: Request<{}, {}, AddUsersAddressByIdInput>, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw new AppError("Unauthorized", 401)
        }

        const userId = req.user.id

        const { address_line, country, province, district, subdistrict, postal_code, is_default } = req.body

        if (!address_line || !country || !province || !district || !subdistrict || !postal_code) {
            throw new AppError("Missing required field", 400)
        }

        const newAddress = await createUsersAddressByIdService(userId, req.body)
        return res.status(201).json({ status: "Success", data: newAddress })
    } catch (err) {
        next(err)
    }
}


export const updateAddressUsersById = async (req: Request<{ id: string }, {}, UpdateUsersAddressInput>, res: Response, next: NextFunction) => {
    try {
        console.log("=== CONTROLLER HIT ===")
        const addressId = Number(req.params.id)

        if (isNaN(addressId)) {
            throw new AppError("Invalid address id ", 400)
        }

        if (!req.user) {
            throw new AppError("Unauthorize", 401)
        }

        const userId = req.user!.id


        const updated = await updateAddressUserByIdService(userId, addressId, req.body)

        res.status(200).json({ status: "Success", data: updated })
    } catch (err) {
        next(err)
    }
}