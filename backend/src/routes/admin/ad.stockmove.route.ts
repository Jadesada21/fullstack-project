import { Router } from 'express'

import {
    getAllStockmovement,
    getStockmovementById
} from '../../controller/stockmove.controller'

const router = Router()

router.route('/')
    .get(getAllStockmovement)

router.route('/:id')
    .get(getStockmovementById)


export default router