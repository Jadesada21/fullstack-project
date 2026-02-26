import { Router } from 'express'

import {
    getOrderItemByOrderId
} from '../../../controller/orderRoute/orderItem.Controller'

import { authorize } from '../../../middleware/authorize'

const router = Router()

router.route('/')
    .get(authorize(['admin', 'customer']), getOrderItemByOrderId)


export default router