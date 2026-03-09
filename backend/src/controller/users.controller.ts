import { NextFunction, Request, Response } from 'express'
import {
    getAllUsersService,
    getUsersByIdService,
    updateUsersByLoginUserService,
    getAllUsersAddressService,
    createUsersAddressByIdService,
    updateAddressUserByLoginUserService,
    getAllMyAddressService,
    setdefaultAddressService
} from '../service/users.service'



import {
    AddUsersAddressByIdInput,
    UpdateUsersAddressInput
} from '../types/address.type'

import { AppError } from '../util/AppError'



export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await getAllUsersService()

        return res.status(200).json({ status: "Success", user })
    } catch (err) {
        next(err)
    }
}


export const getUsersById = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const targetUserId = Number(req.params.id)

        if (!targetUserId || isNaN(targetUserId)) {
            throw new AppError("Invalid user ID", 400)
        }

        const data = await getUsersByIdService(targetUserId, req.user!.id)

        return res.status(200).json({ status: "Success", data })
    } catch (err) {
        next(err)
    }
}


export const updateUsersByLoginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const loginUserId = req.user!.id

        const responese = await updateUsersByLoginUserService(req.user!.id, req.body)

        return res.status(200).json({ status: "Success", responese })
    } catch (err) {
        next(err)
    }
}





// ****************************** ADDRESS



export const getAllUsersAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await getAllUsersAddressService()

        return res.status(200).json({ status: "Success", user })
    } catch (err) {
        next(err)
    }
}


export const addUsersAddressById = async (req: Request<{}, {}, AddUsersAddressByIdInput>, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id

        const { address_line, country, province, district, subdistrict, postal_code, is_default } = req.body

        if (!address_line || !country || !province || !district || !subdistrict || !postal_code) {
            throw new AppError("Missing required field", 400)
        }

        if (address_line || country || province || district || subdistrict || postal_code.length > 50) {
            throw new AppError("Input must not exceed 50 characters", 400)
        }

        const newAddress = await createUsersAddressByIdService(userId, req.body)
        return res.status(201).json({ status: "Success", newAddress })
    } catch (err) {
        next(err)
    }
}


export const updateAddressUserByLoginUser = async (req: Request<{ id: string }, {}, UpdateUsersAddressInput>, res: Response, next: NextFunction) => {
    try {
        const addressId = Number(req.params.id)

        if (isNaN(addressId)) {
            throw new AppError("Invalid address id ", 400)
        }

        if (!req.user) {
            throw new AppError("Forbidden", 401)
        }

        const userId = req.user!.id


        const updated = await updateAddressUserByLoginUserService(userId, addressId, req.body)

        res.status(200).json({ status: "Success", updated })
    } catch (err) {
        next(err)
    }
}

export const getAllMyAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getAllMyAddressService(req.user!.id)
        return res.status(200).json({ status: "Success", data })
    } catch (err) {
        next(err)
    }

}

export const setdefaultAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const addressId = Number(req.params.id)
        if (Number.isNaN(addressId)) {
            throw new AppError("Invalid address Id ", 400)
        }

        const userId = req.user!.id
        const data = await setdefaultAddressService(userId, addressId)
        return res.status(200).json({ status: "Success", data })
    } catch (err) {
        next(err)
    }
}