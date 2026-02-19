import { Router } from 'express'

import {
    getAllCategory,
    createCategory,
    getCategoryById
} from '../controller/category.controller'

const router = Router()

router.route('/')
    .get(getAllCategory)
    .post(createCategory)


router.route('/:id')
    .get(getCategoryById)

export default router