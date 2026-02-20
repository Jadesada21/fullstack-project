import { Router } from "express";
import {
    getAllUsers,
    getUsersById,
    updateUsersById,
} from '../controller/users.controller'



const router = Router();


router.route('/')
    .get(getAllUsers)



router.route('/:id')
    .get(getUsersById)
    .patch(updateUsersById)

export default router;