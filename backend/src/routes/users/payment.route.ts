import { Router } from 'express'

import {
    comfirmPayment,
    cancelledPayment,
    getPaymentById,
} from '../../controller/payment.controller'

import {
    authorize
} from '../../middleware/authorize'

const router = Router()


router.route('/:paymentId/')
    .get(authorize(['admin', 'customer']), getPaymentById)

router.route('/:paymentId/confirm')
    .post(authorize(['customer']), comfirmPayment)

router.route('/:paymentId/cancel')
    .post(authorize(['customer']), cancelledPayment)

export default router
