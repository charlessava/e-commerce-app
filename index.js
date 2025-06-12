const express = require("express")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const dotenv = require("dotenv").config()
const jwt = require("jsonwebtoken")

const { authenticate, authorizeAdmin } = require("./Middlewares/index")

const { handleLogin, handleSignup, handleCreateCategory, handleCreateProduct, handleViewProducts, handleViewOneProduct, handleCreateOrder, handleMyOrders, handleAllOrders } = require("./Controllers/index")


const app = express()
app.use(express.json())


const User = require("./Models/User")
const Category = require("./Models/Category")
const Product = require("./Models/Product")
const Order = require("./Models/Order")


port = process.env.PORT || 5000
mongoDB_url = process.env.MONGODB_URL



mongoose.connect(mongoDB_url)
    .then(
        console.log("Data base connected successfully"),
        app.listen(port, () => {
            console.log(`server started and running on port ${port}`)
        })

    ).catch((error) => {
        console.error((error))
    })

app.get("/", (req, res) => {
    return res.status(200).json({ message: "Welcome to 'BUYWISE' ecommerce app" })

})


// api to signup

app.post("/sign-up", handleSignup);

// api to login
app.post('/login', handleLogin);


// API to create category
app.post("/create-category", authenticate, authorizeAdmin, handleCreateCategory);

// API to create product

app.post("/create-product", authenticate, authorizeAdmin, handleCreateProduct);

// API TO VIEW ALL PRODUCTS

app.get("/view-products", handleViewProducts)


// API TO VIEW A PRODUCT BY id
app.get("/product/:id", handleViewOneProduct);

// API FOR REGISTERED USERS TO PLACE ORDERS

app.post("/create-order", authenticate, handleCreateOrder);

//API for users to view their past orders
app.get("/my-orders", authenticate, handleMyOrders);


//Admin endpoint to view all orders

app.get("/all-orders", authenticate, authorizeAdmin, handleAllOrders);




