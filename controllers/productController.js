import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import orderModel from "../models/orderModel.js";




// import slugify from "slugify";
import slugify from "slugify";
import fs from 'fs';
// payment gateway
import braintree from "braintree";
import dotenv from "dotenv";


dotenv.config();

// payment geteway
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});


export const CreateProductController = async (req, res) => {

    try {
        const { name, slug, description, price, category, quantity, shipping } = req.fields
        const { photo } = req.files

        // validation using swith
        switch (true) {
            case !name:
                return res.status(500).send({ error: 'Name is required' });
            case !description:
                return res.status(500).send({ error: 'description is required' });
            case !price:
                return res.status(500).send({ error: 'price is required' });
            case !category:
                return res.status(500).send({ error: 'category is required' });
            case !quantity:
                return res.status(500).send({ error: 'quantity is required' });
            case photo && photo.size > 100000:
                return res.status(500).send({ error: 'photo is required and should be less than 5mb' });
        }


        const products = new productModel({ ...req.fields, slug: slugify(name) })
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
        }

        await products.save()
        res.status(200).send({
            success: true,
            message: "product created successfully",
            products,
        });

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error in creating product",
        });
    }



};


export const getProductController = async (req, res) => {

    try {
        const products = await productModel.find({})
            .populate('category').select("-photo").limit(12).sort({ createdAt: -1 });

        res.status(200).send({
            success: true,
            totalproduct: products.length,
            message: "All Categories List ",
            products,

        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "error in fatching data from server",
        });
    }



};


export const getSingleProductController = async (req, res) => {
    try {

        const product = await productModel.findOne({ slug: req.params.slug }).select('-photo')
            .populate('category');
        res.status(200).send({
            success: true,
            message: "single Product",
            product,
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "problem to fatch data",
        });
    }
};

export const productPhotoController = async (req, res) => {

    try {
        const product = await productModel.findById(req.params.pid).select("photo")
        if (product.photo.data) {
            res.set('Content-type', product.photo.contentType)
            return res.status(200).send(product.photo.data);
        }

    } catch (error) {
        res.status(500).send({
            success: false,
            error,
            message: "error will getting a photo"
        });

    }

};

export const deleteProductController = async (req, res) => {

    try {

        await productModel.findByIdAndDelete(req.params.pid).select("-photo")
        res.status(200).send({
            success: true,
            message: "delete product successfully"
        });

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Problem found to delete product",
        });
    }

};


export const updateProductController = async (req, res) => {
    try {
        const { name, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;

        // validation using swith
        switch (true) {
            case !name:
                return res.status(500).send({ error: 'Name is required' });
            case !description:
                return res.status(500).send({ error: 'description is required' });
            case !price:
                return res.status(500).send({ error: 'price is required' });
            case !category:
                return res.status(500).send({ error: 'category is required' });
            case !quantity:
                return res.status(500).send({ error: 'quantity is required' });
            case photo && photo.size > 100000:
                return res.status(500).send({ error: 'photo is required and should be less than 5mb' });
        }


        const products = await productModel.findByIdAndUpdate(req.params.pid,
            { ...req.fields, slug: slugify(name) }, { new: true });
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
        }

        await products.save()
        res.status(201).send({
            success: true,
            message: "product update successfully",
            products,
        });

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error in Update product",
        });
    }
};


// filter product
export const productFilterController = async (req, res) => {

    try {
        const { checked, radio } = req.body;
        let args = {};
        if (checked.length > 0) args.category = checked
        if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
        const products = await productModel.find(args);
        res.status(200).send({
            success: true,
            products,
        });

    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "error while filtering products",
            error
        })
    }

};


// product count in pagination
export const productCountController = async (req, res) => {
    try {
        const total = await productModel
            .find({})
            .estimatedDocumentCount()
        res.status(200).send({
            success: true,
            total,
        })

    } catch (error) {
        console.log(error)
        res.status(400).send({
            message: "error in product count",
            error,
            success: false
        })

    }
};

// product list base on page
export const productListController = async (req, res) => {
    try {
        const perPage = 6;
        const page = req.params.page ? req.params.page : 1;
        const products = await productModel
            .find({})
            .select("-photo")
            .skip((page - 1) * perPage)
            .limit(perPage)
            .sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            products,
        });
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            message: "error in per page",
            error
        });
    }

};

// search product
export const searchProductController = async (req, res) => {
    try {

        const { keyword } = req.params;
        const results = await productModel.find({
            $or: [
                { name: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ],
        })
            .select("-photo");
        res.json(results);
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "error in serach product api",
            error,
        });
    }
};


// similar product
export const relatedProductController = async (req, res) => {

    try {
        const { pid, cid } = req.params
        const products = await productModel.find({
            category: cid,
            _id: { $ne: pid }
        }).select("-photo").limit(4).populate("category")
        res.status(200).send({
            success: true,
            products,
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "error while getting product"
        });
    }

};

// get product by category

export const productCategoryController = async (req, res) => {
    try {

        const category = await categoryModel.findOne({ slug: req.params.slug })
        const products = await productModel.find({ category }).populate('category')
        res.status(200).send({
            success: true,
            category,
            products,

        });

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "error while geting a product with category",
            error,
        })
    }
};


// payment getway api
// matching token client through backend
export const braintreeTokenController = async (req, res) => {
    try {
        gateway.clientToken.generate({}, function (err, response) {
            if (err) {
                res.status(500).send(err)

            } else {
                res.send(response);
            }
        });
    } catch (error) {
        console.log(error)
    }
};


// payment api
export const braintreePaymentController = async (req, res) => {
    try {
        const { cart, nonce } = req.body;
        let total = 0;
        cart.map((i) => {
            total += i.price;
        });
        let newTransaction = gateway.transaction.sale(
            {
                amount: total,
                paymentMethodNonce: nonce,
                options: {
                    submitForSettlement:true
                },
            },
            function (error, result) {
                if (result) {
                    const order= new orderModel({
                        products: cart,
                        payment: result,
                        buyer: req.user._id
                    }).save();
                    res.json({ ok: true });
                } else {
                    res.status(500).send(error)
                }
            }
        );
    } catch (error) {
        console.log(error);
    }
};

