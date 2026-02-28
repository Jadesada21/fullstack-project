import { Router } from 'express'


import { getAllUsersAddress } from '../../controller/users.controller'


const router = Router()

router.route('/')
    .get(getAllUsersAddress)


export default router