import { Router } from 'express'
import customerRoute from './customer.route'
import categoryRoute from './category.route'
import addressRoute from './address.route'
import productsRoute from './products.route'
import loginRoute from './login.route'
import logoutRoute from './logout.route'
import registerRoute from './register.route'
import { authenticate } from '../middleware/authenticate'
const router = Router()

// public route

router.use('/register', registerRoute)
router.use('/login', loginRoute)


// verify route

router.use(authenticate)

router.use('/customers', customerRoute)
router.use('/addresses', addressRoute)
router.use('/categories', categoryRoute)
router.use('/products', productsRoute)
router.use('/logout', logoutRoute)


export default router