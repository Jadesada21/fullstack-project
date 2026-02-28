import { Router } from "express";

import {
    addUsersAddressById,
    getAllUsersAddress,
    updateAddressUsersById,
} from '../../controller/users.controller'

const router = Router();

import { authorize } from '../../middleware/authorize'


router.route('/')
    .post(authorize(['customer']), addUsersAddressById)


router.route('/:id')
    .patch(authorize(['customer']), updateAddressUsersById)

export default router