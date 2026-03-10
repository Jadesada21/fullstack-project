import { Router } from 'express'

import {
    createProduct,
    toggleProductActive,
    restockProductByid,
    getAllRestockProductHis
} from '../../../controller/product/product.controller'

import adminImageProductRoute from './ad.image.product.route'


const router = Router()


router.route('/')
    .post(createProduct)

router.route('/:id')
    .patch(toggleProductActive)

router.route('/:id/restock')
    .post(restockProductByid)

router.route('/:id/stock-history')
    .get(getAllRestockProductHis)

// ********************** image_product

router.use('/:product_id/images', adminImageProductRoute)


export default router