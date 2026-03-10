import { NextFunction, Request, Response } from 'express'

import {
    getCartByLoginUserService,
    addToCartService,
    updateCartItemService,
    deleteCartItemService
} from '../service/cart.service'
import { AppError } from '../util/AppError'


export const getCartByLoginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const loginUserId = req.user!.id

        const cart = await getCartByLoginUserService(loginUserId)

        res.status(200).json({ status: "success", data: cart })
    } catch (err) {
        next(err)
    }
}

export const addToCart = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const loginUserId = req.user!.id
        const product_id = Number(req.body)
        const quantity = Number(req.body)

        if (!product_id || isNaN(Number(product_id))) {
            throw new AppError("Invalid product id", 400)
        }

        if (!quantity || isNaN(Number(quantity)) || Number(quantity) < 1) {
            throw new AppError("Invalid quantity", 400)
        }

        const data = await addToCartService(loginUserId, product_id, quantity)
        res.status(201).json({ status: "success", data: data })

    } catch (error) {
        next(error)
    }
}

export const updateCartItem = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const loginUserId = req.user!.id
        const id = Number(req.params)
        const quantity = Number(req.body)

        if (!id || isNaN(Number(id))) {
            throw new AppError("Invalid cart item id", 400)
        }

        if (!quantity || isNaN(Number(quantity)) || Number(quantity) < 1) {
            throw new AppError("Invalid quantity", 400)
        }

        const data = await updateCartItemService(loginUserId, id, quantity)

        res.status(200).json({ status: "success", data: data })

    } catch (error) {
        next(error)
    }
}

export const deleteCartItem = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const loginUserId = req.user!.id
        const id = Number(req.params)

        if (!id || isNaN(Number(id))) {
            throw new AppError("Invalid cart item id", 400)
        }

        const data = await deleteCartItemService(loginUserId, id)

        res.status(200).json({ status: "success", data: data })
    } catch (error) {
        next(error)
    }
}