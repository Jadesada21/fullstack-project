import { Router } from "express";
import {
    getAllCustomer,
    getCustomerById,
    updateCustomerById,
    addCustomerAddressById,
    updateAddressCustomerById
} from '../controller/customerController'


const router = Router();


router.route('/')
    .get(getAllCustomer)



router.route('/:id')
    .get(getCustomerById)
    .patch(updateCustomerById)



// ****************************** ADDRESS

router.route('/:customerId/addresses')
    .post(addCustomerAddressById)


router.route('/:customerId/addresses/:id')
    .patch(updateAddressCustomerById)

export default router;