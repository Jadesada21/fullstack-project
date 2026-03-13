import { Router } from 'express'

import {
    getAllProduct,
    getProductById
} from '../../../controller/product/product.controller'

import { getProductBySearch } from '../../../controller/login.controller'

import imageProductRoute from './imageProduct.route'

import { optionalAuthenticate } from '../../../middleware/optionalAuthenticate'


const router = Router()

router.route('/')
    .get(optionalAuthenticate, getAllProduct)


router.route('/search')
    .get(getProductBySearch)


router.route('/:id')
    .get(getProductById)



// ************************ Image_product

router.use('/:product_id/images', imageProductRoute)

export default router