import { Router } from 'express'

import {
    getAllRedeem,
    adminGetRedeemById
} from '../../controller/redeem/redeem.controller'


const router = Router()


router.route('/')
    .get(getAllRedeem)


router.route('/:id')
    .get(adminGetRedeemById)


export default router