import { Router } from 'express'
const router = Router({ mergeParams: true })

import {
    getImageById,
    uploadImageByProductId,
    updatePrimaryImagesByProductId,
    deleteProductImagesByProductId,
    updateSortOrderByProductId
} from '../../controller/product/image.controller'


import { authorize } from '../../middleware/authorize'


router.route('/')
    .post(authorize('admin'), uploadImageByProductId)
    .delete(authorize('admin'), deleteProductImagesByProductId)

router.route('/primary')
    .patch(authorize('admin'), updatePrimaryImagesByProductId)

router.route('/sort-order')
    .patch(authorize('admin'), updateSortOrderByProductId)

router.route('/:id')
    .get(getImageById)

export default router