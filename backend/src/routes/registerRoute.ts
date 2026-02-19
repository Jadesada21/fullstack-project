import { Router } from 'express'

import {
    createCustomer
} from '../controller/registerController'

const router = Router()

router.route('/')
    .post(createCustomer)

export default router