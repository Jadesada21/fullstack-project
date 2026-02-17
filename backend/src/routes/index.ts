import { Router } from 'express'
import customerRoute from './customerRoute'
import categoryRoute from './categoryRoute'
import addressRoute from './addressRoute'
import productsRoute from './productsRoute'

const router = Router()

router.use('/customers', customerRoute)
router.use('/addresses', addressRoute)
router.use('/categories', categoryRoute)
router.use('/products', productsRoute)

export default router