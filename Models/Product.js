const mongoose = require("mongoose")


const productSchema = new mongoose.Schema({
    name: { type: String, require: true },
    price: { type: Number, require: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", require: true },
    inStock: { type: Boolean, require: true },
    stock: { type: Number, default: 0 },
},
    { timestamp: true }
)



const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

module.exports = Product