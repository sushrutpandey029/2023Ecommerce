import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import Jwt from "jsonwebtoken";

export const registerController = async(req,res) => {
    try{

        const {name,email,password,phone,address,answer} = req.body

        // validation
        if(!name){
            return res.send({message:'Name required'})
        }

        if(!email){
            return res.send({message:'Email required'})
        }

        if(!password){
            return res.send({message:'Password required'})
        }

        if(!phone){
            return res.send({message:'Phone required'})
        }

        if(!address){
            return res.send({message:'Address required'})
        }

        if(!answer){
            return res.send({message:'answer required'})
        }

        // check user
        const existinguser = await userModel.findOne({email:email})
        // existing user
        if(existinguser){
            return res.status(200).send({
                success:false,
                message:"Already User Register Please Login",
            })
        }

        // register user
        const hashedPassword = await hashPassword(password)
        // save
        const user = await new userModel({name,email,phone,address,answer,password:hashedPassword}).save()

        res.status(200).send({
            success:true,
            message:'User Register Successfully',
            user,
        })

    }catch (error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in User Registration',
            error
        })
    }
};


export const loginController = async(req,res) =>{
    try{
        const {email,password} = req.body
        // validation
        if(!email || !password){
            return res.send({message:' Email and password both are invalide'})
        }
        // check user
        const user = await userModel.findOne({email:email})
        if(!user){
            return res.status(404).send({
                success:false,
                message:"Email or user not registerd"
            })
        }
        const match = await comparePassword(password,user.password)
        if(!match){
            return res.status(200).send({
                success:false,
                message:"invalide password"
            });
        }

        // token
        const token = await Jwt.sign({_id:user._id}, process.env.JWT_SECRET,{

            expiresIn:"7d",
        });
        res.status(200).send({
            success:true,
            message:"login user",
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                phone:user.phone,
                address:user.address,
                role:user.role

            },
            token,
        })

    }catch (error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in User login',
            error
        })
    }
};


// forgot passsword

export const forgotPasswordController = async(req,res) =>{
    try{
        const {email,answer,newpassword} = req.body
        if(!email){
            return res.send({message:'email required'})
        }
        if(!answer){
            return res.send({message:'answer required'})
        }
        if(!newpassword){
            return res.send({message:'newpassword required'})
        }


        // check email and ans

        const user = await userModel.findOne({email:email,answer:answer})
        if(!user){
            return res.status(404).send({
                success:false,
                message:"user not found or email and answer wrong"
            })
        }

        const hashed = await hashPassword(newpassword)
        await userModel.findByIdAndUpdate(user._id,{password:hashed});
        res.status(200).send({
            success:true,
            message:"Password Reset successfully"
        });



    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:"somthink went wrong",
            error
        })
    }
}

// test controller 
export const testController =  (req, res) =>{
    res.send("done");
}


// update profile

export const UpdateProfileController = async(req,res)=>{

    try{
        const {name,email,password,address,phone} = req.body
        const user = await userModel.findById(req.user._id)
        // password
        if(password && password.length < 6){
            return res.json({error: 'password is required and 6 character long'})

        }

        const hashedPassword = password ? await hashPassword(password) : undefined

        const updateUser = await userModel.findByIdAndUpdate(req.user._id,{
            name: name || user.name,
            password: hashedPassword || user.password,
            phone: phone || user.phone,
            address: address || user.address,
        },{new:true})
    res.status(200).send({
        success:true,
        message:"user update successfully",
        updateUser
    })
    
    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:"error while updateing profile",
            error
        })
    }

};


// Manage order by user
export const getOrdersController = async (req,res) => {
    try{
        const orders = await orderModel.find({buyer:req.user._id}).populate("products","-photo").populate("buyer","name")
        res.json(orders)
    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error while geting Orders'
        });

    }
};


// manaeneg by admin All orders
export const getAllOrdersController = async (req,res) => {
    try{
        const orders = await orderModel.find({}).populate("products","-photo").populate("buyer","name").sort({createAt:"-1"})
        res.json(orders)
    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error while geting Orders'
        });

    }
};


// update status order
export const orderStatusController = async(req,res)=>{
    try{
        const { orderId } = req.params;
        const { status } = req.body;
        const orders = await orderModel.findByIdAndUpdate(orderId, {status}, {new:true})
        res.json(orders)
    }catch(error){
        console.log(error)
            res.status(500).send({
                success:false,
                message:'Error while updating order',
                error,
            })
        
    }
};




