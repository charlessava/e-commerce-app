const express = require("express")

const router = express.router()
const { authenticate, authorizeAdmin } = require("./Middlewares/index")

const { handleLogin, handleSignup, handleCreateCategory, handleCreateProduct, handleViewProducts, handleViewOneProduct, handleCreateOrder, handleMyOrders, handleAllOrders } = require("./Controllers/index")


const User = require("./Models/User")
const Category = require("./Models/Category")
const Product = require("./Models/Product")
const Order = require("./Models/Order")

//route to signup
router.post("/sign-up", handleSignup);

//route to login

router.post('/login', handleLogin);


// route to create category
router.post("/create-category", authenticate, authorizeAdmin, handleCreateCategory);

// route to create product

router.post("/create-product", authenticate, authorizeAdmin, handleCreateProduct);

// route TO VIEW ALL PRODUCTS

router.get("/view-products", handleViewProducts)


// route TO VIEW A PRODUCT BY id
router.get("/product/:id", handleViewOneProduct);

// route FOR REGISTERED USERS TO PLACE ORDERS

router.post("/create-order", authenticate, handleCreateOrder);

//route for users to view their past orders
router.get("/my-orders", authenticate, handleMyOrders);


//Admin endpoint to view all orders

router.get("/all-orders", authenticate, authorizeAdmin, handleAllOrders);

module.exports = router