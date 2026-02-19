import { Router } from 'express'
import customerRoute from './customerRoute'
import categoryRoute from './categoryRoute'
import addressRoute from './addressRoute'
import productsRoute from './productsRoute'
import loginRoute from './loginRoute'
import logoutRoute from './logoutRoute'
import registerRoute from './registerRoute'
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