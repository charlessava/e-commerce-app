const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number }
    }],
    total: { type: Number, default: 1 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "shipped", "delivered"] },
    shippingAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        zip: { type: String, required: false },
        country: { type: String, required: true },
    },
    paymentMethod: { type: String, enum: ["cash", "card", "online"] }
}, { timestamp: true })



const Order = mongoose.model.Order || mongoose.model("Order", orderSchema)

module.exports = Order