import { Router } from 'express'

import loginRoute from './public-route/login-out-RegisRoute/login.route'
import registerRoute from './public-route/login-out-RegisRoute/register.route'
import logoutRoute from './public-route/login-out-RegisRoute/logout.route'
import getMeRefresh from './public-route/login-out-RegisRoute/getMeRefresh.route'

import userRoute from './users/users.route'
import categoryRoute from './users/category.route'
import productsRoute from './users/product-route/products.route'
import addressRoute from './users/address.route'
import rewardsRoute from './users/reward-route/rewards.route'
import orderRoute from './users/order-route/order.route'
import pointHistoryRoute from './users/pointHistory.route'
import paymentRoute from './users/payment.route'
import redeemRoute from './users/redeem-route/redeem.route'
import promoCodeRoute from './users/promo-route/promoCode.route'
import promoCodeUsagesRoute from './users/promo-route/promoCodeUsages.route'
import cartRoute from './users/cart.route'

import adminStockMoveRoute from './admin/ad.stockmove.route'
import adminAddressesRoute from './admin/ad.addresses.route'
import adminUserRoute from './admin/ad.users.route'
import adminCategoryRoute from './admin/ad.category.route'
import adminProductRoute from './admin/product-route/ad.product.route'
import adminRewardRoute from './admin/reward-route/ad.reward.route'
import adminOrderRoute from './admin/ad.order.route'
import adminPointHistoryRoute from './admin/ad.pointsHistory.route'
import adminPaymentRoute from './admin/ad.payment.route'
import adminRedeemRoute from './admin/ad.redeem.route'
import adminPromoCodeRoute from './admin/ad.promoCode.route'
import adminPromoCodeUsagedRoute from './admin/ad.promoCodeUsages.route'

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
router.use(getMeRefresh)

router.use('/logout', logoutRoute)
router.use('/users', userRoute)
router.use('/addresses', addressRoute)
router.use('/orders', orderRoute)
router.use('/point-histories', pointHistoryRoute)
router.use('/payments', paymentRoute)
router.use('/redeems', redeemRoute)
router.use('/promo-codes', promoCodeRoute)
router.use('/promo-code-usages', promoCodeUsagesRoute)
router.use('/carts', cartRoute)


// authen admin
router.use(authorize('admin'))

router.use('/admin/users', adminUserRoute)
router.use('/admin/addresses', adminAddressesRoute)
router.use('/admin/categories', adminCategoryRoute)
router.use('/admin/products', adminProductRoute)
router.use('/admin/rewards', adminRewardRoute)
router.use('/admin/orders', adminOrderRoute)
router.use('/admin/point-histories', adminPointHistoryRoute)
router.use('/admin/payments', adminPaymentRoute)
router.use('/admin/stock_moves', adminStockMoveRoute)
router.use('/admin/redeems', adminRedeemRoute)
router.use('/admin/promo-codes', adminPromoCodeRoute)
router.use('/admin/promo-code-usages', adminPromoCodeUsagedRoute)



export default router