import { Router } from 'express'

import {
    getAllOrder,
    getOrderById
} from '../../../controller/orderRoute/order.controller'


const router = Router()


router.route('/')
    .get(getAllOrder)


router.route('/:id')
    .get(getOrderById)


export default router