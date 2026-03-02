import { Router } from 'express'

import {
    getRedeemItemByUserId
} from '../../../controller/redeem/redeemItem.Controller'

import { authorize } from '../../../middleware/authorize'

const router = Router()

router.route('/')
    .get(authorize(['admin', 'customer']), getRedeemItemByUserId)


export default router