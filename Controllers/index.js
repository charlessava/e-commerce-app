const express = require("express")

const handleSignup = async (req, res) => {
    try {
        const { userName, email, password, role } = req.body;

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
        const newUser = new User({ userName, password: hashedPassword, email, role });
        await newUser.save();

        // Return success response
        newUser.password = undefined; // exclude password field
        res.status(201).json({ message: 'Account created successfully', newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
const handleLogin = async (req, res) => {
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
            { userId: user._id, role: user.role },
            process.env.ACCESS_TOKEN,
            { expiresIn: '5d' }
        );

        const refreshToken = jwt.sign(
            { userId: user._id, },
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
        console.error("login error:", error.message, error.stack);
        res.status(500).json({ message: 'Internal server error' });
    }
}
const handleCreateCategory = async (req, res) => {
    try {
        const { name, description, parentCategory } = req.body;

        // Validate required fields
        if (!name || !description) {
            return res.status(400).json({ message: "Name and description are required." });
        }

        // Admin access control
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ message: "Access denied. Administrators only." });
        }

        // Normalize name
        const normalizedName = name.trim().toLowerCase();

        // Check if category already exists (case-insensitive)
        const existingCategory = await Category.findOne({
            name: { $regex: new RegExp(`^${normalizedName}$`, 'i') }
        });

        if (existingCategory) {
            return res.status(400).json({ message: "Category already exists" });
        }

        // Create and save new category
        const category = new Category({
            name: normalizedName,
            description,
            parentCategory: parentCategory || null
        });

        await category.save();

        res.status(201).json({
            message: "Category created successfully",
            category
        });

    } catch (error) {
        console.error("Error creating category:", error.message, error.stack);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const handleCreateProduct = async (req, res) => {
    try {
        const { name, price, category, inStock, stock } = req.body;

        // Validate required fields
        if (!name || !price || !category || inStock === undefined) {
            return res.status(400).json({ message: "Name, price, category, and inStock are required." });
        }



        // Normalize name
        const normalizedName = name.trim().toLowerCase();

        // Check if product already exists (case-insensitive)
        const existingProduct = await Product.findOne({
            name: { $regex: new RegExp(`^${normalizedName}$`, 'i') }
        });

        if (existingProduct) {
            return res.status(400).json({ message: "Product already exists." });
        }

        // Create and save product
        const product = new Product({
            name: normalizedName,
            price,
            category,
            inStock,
            stock: stock || 0
        });

        await product.save();

        res.status(201).json({
            message: "Product created successfully",
            product
        });

    } catch (error) {
        console.error("Error creating product:", error.message, error.stack);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const handleViewProducts = async (req, res) => {
    try {
        const product = await Product.find().populate("category");
        res.status(200).json({
            message: "these are the available products",
            product
        }
        )

    } catch (error) {
        res.status(500).json({ message: "Internal error", error })
    }
}

const handleViewOneProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // Find product by ID and populate its category field
        const product = await Product.findById(id).populate("category");

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({
            message: "Product details retrieved successfully",
            product,
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const handleCreateOrder = async (req, res) => {
    try {
        const { items, shippingAddress, paymentMethod } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "Order must have at least one item." });
        }

        let total = 0;

        for (const item of items) {
            const product = await Product.findById(item.product);

            if (!product) {
                return res.status(404).json({ message: `Product not found: ${item.product}` });
            }

            if (item.quantity > product.stock) {
                return res.status(400).json({ message: `Insufficient stock for product: ${product.name}` });
            }

            total += product.price * item.quantity;
        }

        // Save order
        const order = new Order({
            items,
            total,
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            status: "pending"
        });

        await order.save();

        // Decrease stock quantities
        for (const item of items) {
            const product = await Product.findById(item.product);
            product.stock -= item.quantity;
            await product.save();
        }

        res.status(201).json({ message: "Order placed successfully", order });

    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

const handleMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate("items.product")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "User order history retrieved successfully",
            orders
        });
    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

const handleAllOrders = async (req, res) => {
    const orders = await Order.find().populate("user").populate("items.product");
    res.json(orders);
}





module.exports = {
    handleLogin,
    handleSignup,
    handleCreateCategory,
    handleCreateProduct,
    handleViewProducts,
    handleViewOneProduct,
    handleCreateOrders,
    handleMyOrders,
    handleAllOrders,
}