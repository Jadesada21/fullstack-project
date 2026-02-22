import { Router } from 'express'

import {
    logout
} from '../../controller/logout.controller'

const router = Router()

router.route('/')
    .post(logout)

export default router