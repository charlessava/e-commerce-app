const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.ACCESSTOKEN);
        req.user = decoded; // To ensure this includes userId and role
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== "Admin") {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
};

module.exports = {
    authenticate,
    authorizeAdmin
}
