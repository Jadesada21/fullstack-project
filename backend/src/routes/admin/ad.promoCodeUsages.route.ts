import { Router } from 'express'


import {
    getAllRedeemedPromoCodeusages,
    getRedeemedPromoCodeusagesById
} from '../../controller/promo/promoCodeUsages.controller'


const router = Router()


router.route('/')
    .get(getAllRedeemedPromoCodeusages)

router.route('/:id')
    .get(getRedeemedPromoCodeusagesById)


export default router