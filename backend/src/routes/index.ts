import { Router } from 'express'

import loginRoute from './login-out-RegisRoute/login.route'
import registerRoute from './login-out-RegisRoute/register.route'


import userRoute from './users/users.route'
import categoryRoute from './users/category.route'
import productsRoute from './users/productRoute/products.route'
import addressRoute from './users/address.route'
import logoutRoute from './login-out-RegisRoute/logout.route'
import rewardsRoute from './users/rewardRoute/rewards.route'
import orderRoute from './users/orderRoute/order.route'
import pointHistoryRoute from './users/pointHistory.route'
import paymentRoute from './users/payment.route'

import adminAddressesRoute from './admin/ad.addresses.route'
import adminUserRoute from './admin/ad.users.route'
import adminCategoryRoute from './admin/ad.category.route'
import adminProductRoute from './admin/productRoute/ad.product.route'
import adminRewardRoute from './admin/rewardRoute/ad.reward.route'
import adminOrderRoute from './admin/orderRoute/ad.order.route'
import adminPointHistoryRoute from './admin/ad.pointsHistory.route'
import adminPaymentRoute from './admin/ad.payment.route'

import { authenticate } from '../middleware/authenticate'
import { authorize } from '../middleware/authorize'
const router = Router()


// public route
router.use('/register', registerRoute)
router.use('/login', loginRoute)
router.use('/categories', categoryRoute)
router.use('/products', productsRoute)
router.use('/rewards', rewardsRoute)


// verify route
// users route
router.use(authenticate)

router.use('/logout', logoutRoute)
router.use('/users', userRoute)
router.use('/addresses', addressRoute)
router.use('/orders', orderRoute)
router.use('/points-history', pointHistoryRoute)
router.use('/payment', paymentRoute)


// authen admin
router.use(authorize('admin'))

router.use('/admin/users', adminUserRoute)
router.use('/admin/addresses', adminAddressesRoute)
router.use('/admin/categories', adminCategoryRoute)
router.use('/admin/products', adminProductRoute)
router.use('/admin/rewards', adminRewardRoute)
router.use('/admin/orders', adminOrderRoute)
router.use('/admin/points-history', adminPointHistoryRoute)
router.use('/admin/payment', adminPaymentRoute)


export default router