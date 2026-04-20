const express = require("express");
const router = express.Router();
const { login, register } = require("../controllers/auth.controller");
const { verify } = require("jsonwebtoken");
const { verifyToken } = require("../middleware/auth.middleware");

router.post("/login", login);

// only verify the token
// the middleware make all the job
router.get("/verify", verifyToken, (request, response) => {
  return response.status(200).json({ valid: true, user: request.user });
});

router.post("/register", register);

module.exports = router;
