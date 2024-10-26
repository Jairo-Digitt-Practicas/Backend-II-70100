/** @format */

const Product = require("../models/product.model.js");

const getRealtimeProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error("Error al obtener productos en tiempo real:", error);
        res.status(500).json({ error: "Error al obtener los productos" });
    }
};

module.exports = {
    getRealtimeProducts,
};
