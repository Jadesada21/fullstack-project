import { Router } from 'express'

import {
    getAllReward,
    createReward,
    getRewardById,
    toggleRewardActive
} from '../../../controller/reward/reward.controller'

import imageRewardRoute from './imageReward.route'

import { authorize } from '../../../middleware/authorize'



const router = Router()

router.route('/')
    .get(getAllReward)
    .post(authorize('admin'), createReward)

router.route('/:id')
    .get(getRewardById)
    .patch(authorize('admin'), toggleRewardActive)


// ************************ Image_product

router.use('/:product_id/images', imageRewardRoute)

export default router