import { Router } from 'express'

import {
    createReward,
    toggleRewardActive
} from '../../../controller/reward/reward.controller'

import imageRewardRoute from '../../admin/rewardRoute/ad.image.reward.route'

const router = Router()


router.route('/')
    .post(createReward)

router.route('/:id')
    .patch(toggleRewardActive)


// ********************** image_reward

router.use('/:reward_id/images', imageRewardRoute)


export default router