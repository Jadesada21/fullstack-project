import { Router } from "express";
import {
    getAllUsers,
    getUsersById,
    updateUsersById,
} from '../../controller/users.controller'

import { authorize } from '../../middleware/authorize'




const router = Router();


router.route('/:id')
    .get(authorize(['customer']), getUsersById)
    .patch(authorize(['customer']), updateUsersById)

export default router;