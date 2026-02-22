import { Router } from 'express'

import {
    getAllProduct,
    createProduct,
    getProductById,
    toggleProductActive
} from '../../controller/product/product.controller'

import imageProductRoute from './imageProduct.route'


import { authorize } from '../../middleware/authorize'


const router = Router()

router.route('/')
    .get(getAllProduct)
    .post(authorize('admin'), createProduct)

router.route('/:id')
    .get(getProductById)
    .patch(authorize('admin'), toggleProductActive)


// ************************ Image_product

router.use('/:product_id/images', imageProductRoute)

export default router