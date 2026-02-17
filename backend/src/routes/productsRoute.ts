import { Router } from 'express'

import {
    getAllProduct,
    createProduct
} from '../controller/productController'

const router = Router()

router.route('/')
    .get(getAllProduct)
    .post(createProduct)





export default router