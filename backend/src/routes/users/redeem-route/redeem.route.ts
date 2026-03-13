import { Router } from 'express'

import {
    createRedeem,
    updateStatusRedeem,
    getAllRedeemsByLoginUser,
    getRedeemsByIdByLoginUser
} from '../../../controller/redeem/redeem.controller'

import redeemItemRoute from './redeemItem.route'

import {
    authorize
} from '../../../middleware/authorize'

const router = Router()

router.route('/')
    .post(authorize(['customer']), createRedeem)

router.route('/me')
    .get(authorize(['customer']), getAllRedeemsByLoginUser)

router.route('/:id')
    .get(authorize(['customer']), getRedeemsByIdByLoginUser)

router.route('/:id/status')
    .patch(authorize(['customer']), updateStatusRedeem)


// ******************** redeem_items
router.use('/:redeemId/items', redeemItemRoute)


export default router