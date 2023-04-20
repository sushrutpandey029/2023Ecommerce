import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";

export const CreateCategoryController = async(req,res) => {

    try{

        const {name} = req.body
        if(!name){
            return res.status(401).send({
                message:"name is required"
            })
        }

        const existingCategory = await categoryModel.findOne({name:name})
        if(existingCategory){

            return res.status(200).send({
                success:true,
                message:"category Already exits"
            })

        }

        const category = await new categoryModel({name, slug:slugify(name)}).save();
        res.status(201).send({
            success:true,
            message:"Category add successfully",
            category
        })

    }catch (error){
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:"error in category"
        })
    }

};

// update category

export const updateCategoryController = async(req,res) =>{

    try{
        const {name} = req.body
        const {id} = req.params
        const category = await categoryModel.findByIdAndUpdate(id,{name, slug:slugify(name)},{new:true})
        res.status(200).send({
            success:true,
            message:" category update successfully",
            category
        });
    }catch (error){
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:"Error found in update"
        });
    }

};


export const CategoryController = async(req,res) =>{

    try{
        const category = await categoryModel.find({});
        res.status(200).send({
            success:true,
            message:"All Categories List ",
            category,
        })

    }catch (error){
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:"error in fatching data from server",
        });
    }

};

export const singleCategoryController = async(req,res) =>{

    try{

        const category = await categoryModel.findOne({slug:req.params.slug})
        res.status(200).send({
            success:true,
            message:"single category",
            category,
        })

    }catch (error){
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:"problem to fatch data",
        });
    }

};


export const deleteCategoryController = async(req,res) =>{

    try{
        const {id} = req.params
        await categoryModel.findByIdAndDelete(id)
        res.status(200).send({
            success:true,
            message:"delete category successfully"
        });

    }catch (error){
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:"Problem found to delete category",
        });
    }
};