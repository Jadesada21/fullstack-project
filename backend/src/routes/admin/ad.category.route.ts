import { Router } from 'express'

import {
    createCategory
} from '../../controller/category.controller'

const router = Router()


router.route('/')
    .post(createCategory)



export default router