import { Router } from 'express'

import {
    getAllPointsHistory,
    getPointsHistoryByUserId
} from '../../controller/pointHistory.controller'

const router = Router()


router.route('/')
    .get(getAllPointsHistory)

router.route('/users/:userId')
    .get(getPointsHistoryByUserId)


export default router