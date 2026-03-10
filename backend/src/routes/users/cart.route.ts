import { Router } from 'express'

import {
    getCartByLoginUser,
    addToCart,
    updateCartItem,
    deleteCartItem
} from '../../controller/cart.controller'
import {
    authorize
} from '../../middleware/authorize'

const router = Router()


router.route('/')
    .get(authorize(['customer']), getCartByLoginUser)

router.route('/items')
    .post(authorize(['customer']), addToCart)

router.route('/items/:id')
    .patch(authorize(['customer']), updateCartItem)
    .delete(authorize(['customer']), deleteCartItem)

export default router