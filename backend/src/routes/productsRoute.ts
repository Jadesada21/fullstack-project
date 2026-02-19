import { Router } from 'express'

import {
    getAllProduct,
    createProduct,
    getProductById,
    toggleProductActive
} from '../controller/productController'

import { authorize } from '../middleware/authorize'


const router = Router()

router.route('/')
    .get(getAllProduct)
    .post(authorize('admin'), createProduct)

router.route('/:id')
    .get(getProductById)
    .patch(authorize('admin'), toggleProductActive)

export default router