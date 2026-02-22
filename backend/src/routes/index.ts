import { Router } from 'express'
import userRoute from './users.route'
import categoryRoute from './category.route'
import productsRoute from './productRoute/products.route'
import addressRoute from './address.route'
import loginRoute from './login-outRoute/login.route'
import logoutRoute from './login-outRoute/logout.route'
import registerRoute from './register.route'
import rewardsRoute from './rewardRoute.ts/rewards.route'
import { authenticate } from '../middleware/authenticate'

const router = Router()

// public route

router.use('/register', registerRoute)
router.use('/login', loginRoute)


// verify route

router.use(authenticate)

router.use('/logout', logoutRoute)
router.use('/users', userRoute)
router.use('/addresses', addressRoute)
router.use('/categories', categoryRoute)
router.use('/products', productsRoute)
router.use('/rewards', rewardsRoute)

export default router