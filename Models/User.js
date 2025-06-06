const mongoose = require("mongoose")


const userSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    role: { type: String, required: true }, //enum: ["admin", "user"] },  the enum validation is used here to restrict only these 2 entries "user" or "admin"
    password: { type: String, required: true },
    email: { type: String, required: true },
},
    { timestamps: true }
)


const User = mongoose.model.User || mongoose.model("User", userSchema)

module.exports = User