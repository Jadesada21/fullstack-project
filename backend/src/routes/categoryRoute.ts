import { Router } from 'express'

import {
    getAllCategory,
    createCategory,
    getCategoryById
} from '../controller/categoryController'

const router = Router()

router.route('/')
    .get(getAllCategory)
    .post(createCategory)


router.route('/:id')
    .get(getCategoryById)

export default router