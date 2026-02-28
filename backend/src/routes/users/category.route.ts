import { Router } from 'express'

import {
    getAllCategory,
    createCategory,
    getCategoryById,
    getCategoryProductsById,
    getCategoryRewardsById
} from '../../controller/category.controller'

import { authenticate } from '../../middleware/authenticate'

import { authorize } from '../../middleware/authorize'

const router = Router()


router.route('/')
    .get(getAllCategory)
    .post(authenticate, authorize(['admin']), createCategory)

router.route('/:id')
    .get(getCategoryById)

router.route('/:id/products')
    .get(getCategoryProductsById)

router.route('/:id/rewards')
    .get(getCategoryRewardsById)

export default router