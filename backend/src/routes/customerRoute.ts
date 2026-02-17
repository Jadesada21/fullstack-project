import { Router } from "express";
import {
    getAllCustomer,
    createCustomer,
    getCustomerById,
    updateCustomerById,
} from '../controller/customerController'

import {
    addCustomerAddressById,
    updateAddressCustomerById
} from '../controller/addressController'

const router = Router();


/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: Get all customers
 *     tags:
 *       - customers
 *     responses:
 *       200:
 *         description: List of customers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   username:
 *                     type: string
 *                     example: johndoe
 *                   email:
 *                     type: string
 *                     example: john@gmail.com
 *                   first_name:
 *                     type: string
 *                     example: John
 *                   last_name:
 *                     type: string
 *                     example: Doe
 *                   role:
 *                     type: string
 *                     example: admin
 *       500:
 *         description: Server error
 *
 *   post:
 *     summary: Create new customer
 *     tags:
 *       - customers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - email
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 example: 123456
 *               email:
 *                 type: string
 *                 example: john@gmail.com
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: Customer created
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */

router.route('/')
    .get(getAllCustomer)
    .post(createCustomer)

/**
 * @swagger
 * /api/customers/:id
 *   get:
 *     summary: Get customers by Id
 *     tags:
 *       - customers
 *     responses:
 *       200:
 *         description: select customers by Id
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   username:
 *                     type: string
 *                     example: johndoe
 *                   password:
 *                     type: string
 *                     example: hashed_password
 *                   email:
 *                     type: string
 *                     example: john@gmail.com
 *                   first_name:
 *                     type: string
 *                     example: John
 *                   last_name:
 *                     type: string
 *                     example: Doe
 *                   role:
 *                     type: string
 *                     example: admin
 *       500:
 *         description: Server error
 */

router.route('/:id')
    .get(getCustomerById)
    .patch(updateCustomerById)


router.route('/:customerId/addresses')
    .post(addCustomerAddressById)


router.route('/:customerId/addresses/:id')
    .patch(updateAddressCustomerById)

export default router;