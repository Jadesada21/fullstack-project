import { Router } from 'express'

import {
    getPointsHistoryByUserId
} from '../../controller/pointHistory.controller'

import { authorize } from '../../middleware/authorize'

const router = Router()

router.route('/users/:userId')
    .get(authorize('admin', 'customer'), getPointsHistoryByUserId)


export default router