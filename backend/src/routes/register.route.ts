import { Router } from 'express'

import {
    createUsers
} from '../controller/register.controller'

const router = Router()

router.route('/')
    .post(createUsers)

export default router