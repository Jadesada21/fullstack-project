import { Router } from 'express'

import {
    getAllPointsHistory
} from '../../controller/pointHistory.controller'


const router = Router()


router.route('/')
    .get(getAllPointsHistory)


export default router