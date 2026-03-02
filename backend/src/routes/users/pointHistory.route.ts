import { Router } from 'express'

import {
    getMyPointsHistory
} from '../../controller/pointHistories.controller'

import { authorize } from '../../middleware/authorize'

const router = Router()

router.route('/users/me')
    .get(authorize(['customer']), getMyPointsHistory)

export default router