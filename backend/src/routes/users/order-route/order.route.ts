import { Router } from 'express'

import {
    createOrder,
    cancelOrder,
    getAllOrderByLoginUser,
    getOrderByIdByLoginUser,
    createOrderFromCart
} from '../../../controller/order/order.controller'

import orderItemRoute from './orderItems.route'

import {
    createPayment
} from '../../../controller/payment.controller'

import {
    authorize
} from '../../../middleware/authorize'

const router = Router()

router.route('/')
    .post(authorize(['customer']), createOrder)

router.route('/me')
    .get(authorize(['customer']), getAllOrderByLoginUser)

router.route('/checkout')
    .post(authorize(['customer']), createOrderFromCart)

router.route('/:id')
    .get(authorize(['customer']), getOrderByIdByLoginUser)


router.route('/:id/cancel')
    .patch(authorize(['customer']), cancelOrder)

router.route('/:orderId/payment')
    .post(authorize(['customer']), createPayment)


// ******************** order_items
router.use('/:orderId/items', orderItemRoute)


export default router