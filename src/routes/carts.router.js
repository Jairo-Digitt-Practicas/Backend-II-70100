/** @format */
const { Router } = require("express");
const {
    getAllCarts,
    createCart,
    getCartById,
    addProductToCart,
    removeProductFromCart,
    updateCartProducts,
    updateProductQuantityInCart,
    deleteAllProductsFromCart,
} = require("../controllers/carts.controller.js");

const Cart = require("../models/Cart.js"); // Asegúrate de tener los modelos necesarios
const Product = require("../models/Product.js");
const Ticket = require("../models/Ticket.js"); // No olvides definir el modelo Ticket
const router = Router();

router.get("/", async (req, res) => {
    try {
        const carts = await getAllCarts();
        res.json(carts);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los carritos" });
    }
});

router.post("/", async (req, res) => {
    try {
        const newCart = await createCart(req.body);
        res.status(201).json(newCart);
    } catch (error) {
        res.status(400).json({
            error: "Error al crear el carrito",
            details: error.message,
        });
    }
});

router.get("/:cid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        if (!cartId) {
            return res
                .status(400)
                .json({ error: "ID del carrito es requerido" });
        }
        const cart = await getCartById(cartId);
        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }
        res.json(cart);
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        res.status(500).json({
            error: "Error al obtener el carrito",
            details: error.message,
        });
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const updatedCart = await addProductToCart(
            req.params.cid,
            req.params.pid
        );
        res.status(201).json(updatedCart);
    } catch (error) {
        res.status(400).json({
            error: "Error al agregar el producto al carrito",
            details: error.message,
        });
    }
});

router.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const result = await removeProductFromCart(
            req.params.cid,
            req.params.pid
        );
        if (result) {
            res.json({ message: "Producto eliminado del carrito" });
        } else {
            res.status(404).json({ error: "Carrito o producto no encontrado" });
        }
    } catch (error) {
        res.status(500).json({
            error: "Error al eliminar el producto del carrito",
            details: error.message,
        });
    }
});

router.put("/:cid", async (req, res) => {
    try {
        const updatedCart = await updateCartProducts(
            req.params.cid,
            req.body.products
        );
        res.json(updatedCart);
    } catch (error) {
        res.status(400).json({
            error: "Error al actualizar los productos del carrito",
            details: error.message,
        });
    }
});

router.put("/:cid/products/:pid", async (req, res) => {
    try {
        const updatedCart = await updateProductQuantityInCart(
            req.params.cid,
            req.params.pid,
            req.body.quantity
        );
        res.json(updatedCart);
    } catch (error) {
        res.status(400).json({
            error: "Error al actualizar la cantidad del producto en el carrito",
            details: error.message,
        });
    }
});

router.delete("/:cid", async (req, res) => {
    try {
        const result = await deleteAllProductsFromCart(req.params.cid);
        if (result) {
            res.json({ message: "Todos los productos eliminados del carrito" });
        } else {
            res.status(404).json({ error: "Carrito no encontrado" });
        }
    } catch (error) {
        res.status(500).json({
            error: "Error al eliminar los productos del carrito",
            details: error.message,
        });
    }
});

router.post("/:cid/purchase", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await Cart.findById(cartId).populate("products.product");
        const unavailableProducts = [];

        for (const item of cart.products) {
            const product = await Product.findById(item.product._id);
            if (product.stock < item.quantity) {
                unavailableProducts.push(item.product._id);
            } else {
                product.stock -= item.quantity;
                await product.save();
            }
        }

        if (unavailableProducts.length < cart.products.length) {
            const ticket = new Ticket({
                code: generateUniqueCode(),
                amount: cart.products.reduce(
                    (total, p) => total + p.product.price * p.quantity,
                    0
                ),
                purchaser: req.user.email,
            });
            await ticket.save();
            res.status(201).json({ message: "Compra exitosa", ticket });
        } else {
            res.status(400).json({
                message: "No hay suficiente stock para algunos productos",
                unavailableProducts,
            });
        }
    } catch (error) {
        res.status(500).json({
            error: "Error al procesar la compra",
            details: error.message,
        });
    }
});

function generateUniqueCode() {
    return Math.random().toString(36).substr(2, 9).toUpperCase();
}

module.exports = router;
