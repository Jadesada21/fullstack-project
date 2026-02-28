import { Router } from 'express'

import {
    getAllUsers
} from '../../controller/users.controller'


const router = Router()


router.route('/')
    .get(getAllUsers)



export default router