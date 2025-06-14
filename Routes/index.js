const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
// const userRoutes = require("./userRoutes"); // to be added in future
// const adminRoutes = require("./adminRoutes"); // To be added in future

// Combining all routes under the same base path
router.use(authRoutes);
// router.use(userRoutes);
// router.use(adminRoutes);

module.exports = router;