import { Router } from 'express'

import {
    getAllPromoCode,
    createPromoCode,
    getPromoCodeById,
    togglePromoCodeActive
} from '../../controller/promo/promoCode.controller'


const router = Router()


router.route('/')
    .get(getAllPromoCode)
    .post(createPromoCode)

router.route('/:id')
    .get(getPromoCodeById)
    .patch(togglePromoCodeActive)

export default router