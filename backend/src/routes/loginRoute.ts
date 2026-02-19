import { Router } from 'express'

import {
    login
} from '../controller/loginController'

const router = Router()

router.route('/')
    .post(login)

export default router