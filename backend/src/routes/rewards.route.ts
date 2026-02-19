import { Router } from 'express'

import {
    getAllReward,
    createReward,
    getRewardById,
    toggleRewardActive
} from '../controller/reward.controller'

import { authorize } from '../middleware/authorize'


const router = Router()

router.route('/')
    .get(getAllReward)
    .post(authorize('admin'), createReward)

router.route('/:id')
    .get(getRewardById)
    .patch(authorize('admin'), toggleRewardActive)

export default router