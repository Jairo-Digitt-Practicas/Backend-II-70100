/** @format */

const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const cartSchema = new mongoose.Schema({
    products: [
        {
            product: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
            quantity: Number,
        },
    ],
});

cartSchema.plugin(mongoosePaginate);

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
