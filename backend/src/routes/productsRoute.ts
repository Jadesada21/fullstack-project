import { Router } from 'express'

import {
    getAllProduct,
    createProduct,
    getProductById
} from '../controller/productController'

const router = Router()

router.route('/')
    .get(getAllProduct)
    .post(createProduct)

router.route('/:id')
    .get(getProductById)


export default router