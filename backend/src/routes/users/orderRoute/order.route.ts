import { Router } from 'express'

import {
    createOrder,
    updateStatusOrder,
    getOrderByUserId
} from '../../../controller/orderRoute/order.controller'

import orderItemRoute from './orderItems.route'


const router = Router()

router.route('/')
    .post(createOrder)

router.route('/me')
    .get(getOrderByUserId)

router.route('/:id/status')
    .patch(updateStatusOrder)


// ******************** order_items
router.use('/:orderId/items', orderItemRoute)


export default router