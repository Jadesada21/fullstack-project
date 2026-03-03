import { Router } from 'express'

import {
    getMyPromoCodeUsage,
    redeemPromoCode
} from '../../../controller/promo/promoCodeUsages.controller'

import { authorize } from '../../../middleware/authorize'

const router = Router()

router.route('/my')
    .get(authorize(['customer']), getMyPromoCodeUsage)


export default router