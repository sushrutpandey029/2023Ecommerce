import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import { CreateProductController, getProductController,
     getSingleProductController 
     ,productPhotoController,deleteProductController
     ,updateProductController,productFilterController,
     productCountController,productListController,searchProductController
     ,relatedProductController,productCategoryController,braintreeTokenController,
     braintreePaymentController

} from "../controllers/productController.js";
import formidable from 'express-formidable';


const router = express.Router()

// router

router.post('/create-product', requireSignIn, isAdmin, formidable(), CreateProductController);


router.put('/update-product/:pid', requireSignIn, isAdmin, formidable(), updateProductController)

router.get('/get-product', getProductController)

router.get('/get-product/:slug', getSingleProductController)

router.delete('/delete-product/:pid',deleteProductController)


// get photo
router.get('/product-photo/:pid',productPhotoController)

// Filter product
router.post('/product-filters', productFilterController)

// pagination product count
router.get('/product-count', productCountController)

// product per page
router.get('/product-list/:page', productListController)


// Search product filter product
router.get('/search/:keyword', searchProductController)


// Similar Product
router.get('/related-product/:pid/:cid', relatedProductController)

// categories wise product
router.get('/product-category/:slug', productCategoryController)


// Payment gateway rotes
// token
router.get('/breaintree/token', braintreeTokenController)


// payments
router.post('/breaintree/payment', requireSignIn, braintreePaymentController)

export default router;