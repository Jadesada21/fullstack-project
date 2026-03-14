import { Router } from 'express'

import {
    getAllProduct,
    createProduct,
    getProductById,
} from '../../../controller/product/product.controller'

import imageProductRoute from './imageProduct.route'


import { authorize } from '../../../middleware/authorize'


const router = Router()

router.route('/')
    .get(getAllProduct)

router.route('/:id')
    .get(getProductById)


// ************************ Image_product

router.use('/:product_id/images', imageProductRoute)

export default router