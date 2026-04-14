// import express framework to create the app
const express = require("express");
// require the path to manage the directories
const path = require("path");
require("dotenv").config();
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/products.routes");
const translationRoutes = require("./routes/translations.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/translations", translationRoutes);

app.get("/", (request, response) => {
  response.send("Api is running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
