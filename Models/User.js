const mongoose = require("mongoose")


const userSchema = new mongoose.Schema({
    name: { type: String, require: true },
    role: { type: String, require: true, enum: ["admin", "user"] },  //the enum validation is used here to restrict only these 2 entries "user" or "admin"
    password: { type: String, require: true },
    email: { type: String, require: true },
},
    { timestamp: true }
)


const User = mongoose.model.User || mongoose.model("User", userSchema)

module.exports = User