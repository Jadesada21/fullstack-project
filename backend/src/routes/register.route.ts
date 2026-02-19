import { Router } from 'express'

import {
    createCustomer
} from '../controller/register.controller'

const router = Router()

router.route('/')
    .post(createCustomer)

export default router