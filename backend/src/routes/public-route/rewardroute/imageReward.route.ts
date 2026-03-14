import { Router } from 'express'
const router = Router({ mergeParams: true })

import {
    getImageById,
    uploadImageByRewardId,
    updatePrimaryImagesByRewardId,
    deleteRewardImagesByRewardId,
    updateSortOrderByRewardId
} from '../../../controller/reward/image.controller'


import { authorize } from '../../../middleware/authorize'
import upload from '../../../middleware/upload'


router.route('/')
    .post(authorize('admin'), upload.array("images", 5), uploadImageByRewardId)
    .delete(authorize('admin'), deleteRewardImagesByRewardId)

router.route('/primary')
    .patch(authorize('admin'), updatePrimaryImagesByRewardId)

router.route('/sort-order')
    .patch(authorize('admin'), updateSortOrderByRewardId)

router.route('/:id')
    .get(getImageById)



export default router