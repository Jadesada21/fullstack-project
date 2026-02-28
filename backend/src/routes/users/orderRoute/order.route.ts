import { Router } from 'express'

import {
    createOrder,
    updateStatusOrder,
    getOrderByUserId
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
    .get(authorize(['customer']), getOrderByUserId)

router.route('/:id/status')
    .patch(authorize(['customer']), updateStatusOrder)


router.route('/:orderId/payment')
    .post(authorize(['customer']), createPayment)


// ******************** order_items
router.use('/:orderId/items', orderItemRoute)


export default router