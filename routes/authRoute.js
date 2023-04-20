import express from 'express';
import { requireSignIn, isAdmin } from '../middlewares/authMiddleware.js';
import { registerController,loginController,testController,
    forgotPasswordController,UpdateProfileController,getOrdersController,
    getAllOrdersController,orderStatusController

} from '../controllers/authController.js'

// route object 
const router = express.Router()

// routing
// Registrer || method post
router.post('/register',registerController)

// login post
router.post('/login',loginController)

// forget password

router.post('/forgot-password',forgotPasswordController)

// test rout authentication
router.get('/test', requireSignIn , isAdmin,  testController)

// protected user route api for 
router.get('/user-auth',requireSignIn, (req,res)=>{
    res.status(200).send({ok: true});
});

// Admin protected route auth

router.get('/admin-auth',requireSignIn, isAdmin, (req,res)=>{
    res.status(200).send({ok: true});
});


// update profile
router.put('/profile', requireSignIn,  UpdateProfileController)

// orders
router.get('/orders', requireSignIn,  getOrdersController)

// All orders
router.get('/all-orders', requireSignIn,isAdmin,  getAllOrdersController)

// update order status
router.put('/order-status/:orderId', requireSignIn,isAdmin,  orderStatusController)

export default router