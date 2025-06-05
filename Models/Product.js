const mongoose = require("mongoose")


const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    inStock: { type: Boolean, required: true },
    stock: { type: Number, default: 0 },
},
    { timestamps: true }
)



const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

module.exports = Product