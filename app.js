/** @format */

const express = require("express");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./database/database");
const sessionRouter = require("./routes/sessionRoutes");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));

require("./config/passport");
app.use(passport.initialize());

connectDB();

app.use("/api/sessions", sessionRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
