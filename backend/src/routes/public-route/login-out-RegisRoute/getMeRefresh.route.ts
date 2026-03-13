import { Router } from 'express'

import {
    getMeRefresh
} from '../../../controller/getMeRefresh.controller'

const router = Router()

router.route('/me')
    .get(getMeRefresh)

export default router