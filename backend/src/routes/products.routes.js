const express = require("express");
const router = express.Router();

const {
  getAllProducts,
  updateProduct,
} = require("../controllers/product.controller");

const { verifyToken } = require("../middleware/auth.middleware");

router.use(verifyToken);

router.get("/", getAllProducts);
router.put("/:id", updateProduct);

module.exports = router;
