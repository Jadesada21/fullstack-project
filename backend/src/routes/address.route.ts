import { Router } from "express";

import {
    getAllCustomerAddress
} from '../controller/address.controller'

const router = Router()

router.route('/')
    .get(getAllCustomerAddress)



export default router