import { Router } from 'express'


import {
    getAllPayment
} from '../../controller/payment.controller'

const router = Router()

router.route('/')
    .get(getAllPayment)


export default router