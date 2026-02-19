import { Router } from 'express'

import {
    logout
} from '../controller/logoutController'

const router = Router()

router.route('/')
    .post(logout)

export default router