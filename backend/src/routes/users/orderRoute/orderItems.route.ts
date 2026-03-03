import { Router } from 'express'
const router = Router({ mergeParams: true })

import {
    getOrderItemByOrderIdandUserId
} from '../../../controller/order/orderItem.Controller'

import { authorize } from '../../../middleware/authorize'


router.route('/')
    .get(authorize(['admin', 'customer']), getOrderItemByOrderIdandUserId)


export default router