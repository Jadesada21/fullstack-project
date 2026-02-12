import { Request, Response } from 'express'
import { getAllCustomerService, createCustomerService, getCustomerByIdService } from '../service/customerService'
import { CreateCustomerInput } from '../types/customer.type'

const getAllCustomer = async (req: Request, res: Response) => {
    try {
        const customer = await getAllCustomerService()

        return res.status(200).json({ status: "Success", data: customer })
    } catch (err: any) {
        return res.status(400).json({ status: "Failed", message: err.message })
    }
}


const createCustomer = async (req: Request<{}, {}, CreateCustomerInput>, res: Response) => {
    const { username, password, email, first_name, last_name, role } = req.body

    if (!username || !password || !email || !first_name || !last_name || !role) {
        return res.status(400).json({ status: "Error", message: "Missing required fields" })
    }

    try {
        const newCustomer = await createCustomerService(req.body)
        return res.status(200).json({ status: "Success", data: newCustomer })
    } catch (err: any) {
        return res.status(400).json({ status: "Error", messsage: err.message })
    }
}


const getCustomerById = async (req: Request, res: Response) => {
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


export {
    getAllCustomer,
    createCustomer,
    getCustomerById
}