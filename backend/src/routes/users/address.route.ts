import { Router } from "express";

import {
    addUsersAddressById,
    updateAddressUserByLoginUser,
    getAllMyAddress,
    setdefaultAddress
} from '../../controller/users.controller'

const router = Router();

import { authorize } from '../../middleware/authorize'


router.route('/')
    .post(authorize(['customer']), addUsersAddressById)

router.route('/me')
    .get(authorize(['customer']), getAllMyAddress)

router.route('/update/:id')
    .patch(authorize(['customer']), updateAddressUserByLoginUser)

router.route('/:id/default')
    .patch(authorize(['customer']), setdefaultAddress)

export default router