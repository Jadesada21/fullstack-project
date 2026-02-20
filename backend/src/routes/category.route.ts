import { Router } from 'express'

import {
    getAllCategory,
    createCategory,
    getCategoryById,
    getCategoryProductsById,
    getCategoryRewardsById
} from '../controller/category.controller'

const router = Router()

router.route('/')
    .get(getAllCategory)
    .post(createCategory)


router.route('/:id')
    .get(getCategoryById)

router.route('/:id/products')
    .get(getCategoryProductsById)

router.route('/:id/rewards')
    .get(getCategoryRewardsById)

export default router