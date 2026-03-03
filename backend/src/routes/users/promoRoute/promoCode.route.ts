import { Router } from 'express'

import {
    redeemPromoCode
} from '../../../controller/promo/promoCodeUsages.controller'

import { authorize } from '../../../middleware/authorize'

const router = Router()

router.route('/redeem')
    .post(authorize(['customer']), redeemPromoCode)

export default router