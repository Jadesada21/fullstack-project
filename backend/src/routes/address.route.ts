import { Router } from "express";

import {
    addUsersAddressById,
    getAllUsersAddress,
    updateAddressUsersById,
} from '../controller/users.controller'

const router = Router();


router.route('/')
    .get(getAllUsersAddress)
    .post(addUsersAddressById)


router.route('/:id')
    .patch(updateAddressUsersById)

export default router