import { Router } from 'express'

import {
    getAllReward,
    getRewardById,
} from '../../../controller/reward/reward.controller'

import imageRewardRoute from './imageReward.route'




const router = Router()

router.route('/')
    .get(getAllReward)


router.route('/:id')
    .get(getRewardById)


// ************************ Image_reward

router.use('/:reward_id/images', imageRewardRoute)

export default router