/** @format */
const mongoose = require("mongoose");
const Cart = require("../models/Cart.js");
const Product = require("../models/Product.js");

// Verifica si un ID es válido
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Obtener todos los carritos
const getAllCarts = async () => {
    return await Cart.find().populate("products.product");
};

// Crear un nuevo carrito
const createCart = async (cartData) => {
    try {
        const newCart = new Cart(cartData);
        return await newCart.save();
    } catch (error) {
        throw new Error("Error al crear el carrito: " + error.message);
    }
};

// Obtener un carrito por ID
const getCartById = async (cartId) => {
    console.log("ID recibido:", cartId);
    if (!isValidObjectId(cartId)) {
        console.error("ID del carrito no es válido:", cartId);
        throw new Error("ID del carrito no es válido");
    }
    try {
        const cart = await Cart.findById(cartId);
        if (!cart) {
            throw new Error("Carrito no encontrado");
        }
        return cart;
    } catch (error) {
        throw new Error(`Error al obtener el carrito: ${error.message}`);
    }
};

// Agregar un producto al carrito
const addProductToCart = async (cid, pid) => {
    if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
        return { error: "ID del carrito o del producto no es válido" };
    }
    try {
        const cart = await Cart.findById(cid);
        if (!cart) {
            return { error: "Carrito no encontrado" };
        }
        const product = await Product.findById(pid);
        if (!product) {
            return { error: "Producto no encontrado" };
        }
        const productIndex = cart.products.findIndex(
            (p) => p.product.toString() === pid
        );
        if (productIndex !== -1) {
            cart.products[productIndex].quantity += 1;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }
        await cart.save();
        return cart;
    } catch (error) {
        throw new Error(
            "Error al agregar el producto al carrito: " + error.message
        );
    }
};

// Actualizar los productos del carrito
const updateCartProducts = async (cid, products) => {
    if (!isValidObjectId(cid)) {
        return { error: "ID del carrito no es válido" };
    }
    try {
        const cart = await Cart.findById(cid);
        if (!cart) {
            return { error: "Carrito no encontrado" };
        }
        cart.products = products;
        await cart.save();
        return cart;
    } catch (error) {
        throw new Error(
            "Error al actualizar los productos del carrito: " + error.message
        );
    }
};

// Actualizar la cantidad de un producto en el carrito
const updateProductQuantityInCart = async (cid, pid, quantity) => {
    if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
        return { error: "ID del carrito o del producto no es válido" };
    }
    try {
        const cart = await Cart.findById(cid);
        if (!cart) {
            return { error: "Carrito no encontrado" };
        }
        const productIndex = cart.products.findIndex(
            (p) => p.product.toString() === pid
        );
        if (productIndex !== -1) {
            cart.products[productIndex].quantity = quantity;
        } else {
            return { error: "Producto no encontrado en el carrito" };
        }
        await cart.save();
        return cart;
    } catch (error) {
        throw new Error(
            "Error al actualizar la cantidad del producto en el carrito: " +
                error.message
        );
    }
};

// Eliminar un producto del carrito
const deleteProductFromCart = async (cid, pid) => {
    if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
        return { error: "ID del carrito o del producto no es válido" };
    }
    try {
        const cart = await Cart.findById(cid);
        if (!cart) {
            return { error: "Carrito no encontrado" };
        }
        cart.products = cart.products.filter(
            (p) => p.product.toString() !== pid
        );
        await cart.save();
        return cart;
    } catch (error) {
        throw new Error(
            "Error al eliminar el producto del carrito: " + error.message
        );
    }
};

// Eliminar todos los productos del carrito
const deleteAllProductsFromCart = async (cid) => {
    if (!isValidObjectId(cid)) {
        return { error: "ID del carrito no es válido" };
    }
    try {
        const cart = await Cart.findById(cid);
        if (!cart) {
            return { error: "Carrito no encontrado" };
        }
        cart.products = [];
        await cart.save();
        return cart;
    } catch (error) {
        throw new Error(
            "Error al eliminar todos los productos del carrito: " +
                error.message
        );
    }
};

// Remover un producto del carrito
const removeProductFromCart = async (cid, pid) => {
    if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
        return { error: "ID del carrito o del producto no es válido" };
    }
    try {
        const cart = await Cart.findById(cid);
        if (!cart) {
            throw new Error("Carrito no encontrado");
        }
        const productIndex = cart.products.findIndex(
            (p) => p.product.toString() === pid
        );
        if (productIndex === -1) {
            throw new Error("Producto no encontrado en el carrito");
        }
        cart.products.splice(productIndex, 1);
        await cart.save();
        return cart;
    } catch (error) {
        throw new Error(
            "Error al eliminar el producto del carrito: " + error.message
        );
    }
};

module.exports = {
    getAllCarts,
    createCart,
    getCartById,
    addProductToCart,
    updateCartProducts,
    updateProductQuantityInCart,
    deleteProductFromCart,
    deleteAllProductsFromCart,
    removeProductFromCart,
};
