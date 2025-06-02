const express = require("express")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const dotenv = require("dotenv").config()
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

app.post("/sign-up", async (req, res) => {
    try {
        const { userName, email, password } = req.body;

        // Validate input
        if (!userName) {
            return res.status(400).json({ message: 'Username is required' });
        }

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Choose a stronger password' });
        }

        // Check for existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create new user
        const newUser = new User({ userName, password: hashedPassword, email });
        await newUser.save();

        // Return success response
        newUser.password = undefined; // exclude password field
        res.status(201).json({ message: 'Account created successfully', newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});