import { Router } from 'express'

import {
    getOrderItemByOrderId
} from '../../../controller/order/orderItem.Controller'

import { authorize } from '../../../middleware/authorize'

const router = Router()

router.route('/')
    .get(authorize(['admin', 'customer']), getOrderItemByOrderId)


export default router