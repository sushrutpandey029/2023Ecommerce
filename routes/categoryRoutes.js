import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import { CreateCategoryController, updateCategoryController,
     CategoryController,singleCategoryController, deleteCategoryController } from "../controllers/categoryController.js";

const router = express.Router()

// router

router.post('/create-category',requireSignIn, isAdmin, CreateCategoryController);


router.put('/update-category/:id', requireSignIn, isAdmin, updateCategoryController)

router.get('/get-category', CategoryController)

router.get('/single-category/:slug',  singleCategoryController)

router.delete('/delete-category/:id', requireSignIn, isAdmin, deleteCategoryController)

export default router