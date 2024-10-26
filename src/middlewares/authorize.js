/** @format */

// middleware/authorize.js
const authorize = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json({ message: "Acceso denegado" });
        }
        next();
    };
};

module.exports = authorize;
