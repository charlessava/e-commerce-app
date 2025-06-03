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
const authenticate = require("./Middlewares/index")




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


// Login API endpoint
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // 2. Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // 3. Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // 4. Generate JWT tokens
        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.ACCESSTOKEN,
            { expiresIn: '1h' }
        );

        const refreshToken = jwt.sign(
            { userId: user._id },
            process.env.REFRESH_TOKEN,
            { expiresIn: '7d' }
        );

        // 5. Send response (excluding sensitive data like password)
        const { _id, userName, role } = user;

        res.status(200).json({
            message: "Login successful",
            user: {
                id: _id,
                userName,
                email,
                role
            },
            accessToken,
            refreshToken
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


//Role based access control

app.post("/create-category", authenticate, async (req, res) => {
    try {
        const { name, description, parentCategory } = req.body;

        // Validate inputs
        if (!name || !description) {
            return res.status(400).json({ message: "Name and description are required." });
        }

        // Check user role
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        // Create and save new category
        const category = new Category({
            name,
            description,
            parentCategory: parentCategory || null
        });

        await category.save();

        res.status(201).json({
            message: "Category created successfully",
            category
        });

    } catch (error) {
        console.error("Error creating category:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
