import { Router } from "express";

import {
    updateAddressCustomerById,
    getAllCustomerAddress,
} from '../controller/addressController'

const router = Router()

router.route('/')
    .get(getAllCustomerAddress)



export default router