import { Router } from "express";

import {
    updateUsersByLoginUser,
} from '../../controller/users.controller'

import { getUserByLoginUser } from "../../controller/user-detail/profiles.controller";


import { authorize } from '../../middleware/authorize'




const router = Router();

router.route('/me')
    .get(authorize(['customer']), getUserByLoginUser)

router.route('/update')
    .patch(authorize(['customer']), updateUsersByLoginUser)

export default router;