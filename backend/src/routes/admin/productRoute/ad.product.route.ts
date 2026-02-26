import { Router } from 'express'

import {
    createProduct,
    toggleProductActive
} from '../../../controller/product/product.controller'

import adminImageProductRoute from './ad.image.product.route'


const router = Router()


router.route('/')
    .post(createProduct)

router.route('/:id')
    .patch(toggleProductActive)


// ********************** image_product

router.use('/:product_id/images', adminImageProductRoute)


export default router