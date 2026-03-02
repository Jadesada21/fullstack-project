import { Router } from 'express'

import {
    getAllRedeem,
    getRedeemById
} from '../../controller/redeem/redeem.controller'


const router = Router()


router.route('/')
    .get(getAllRedeem)


router.route('/:id')
    .get(getRedeemById)


export default router