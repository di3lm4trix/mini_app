const express = require("express");
const router = express.Router();
const { login } = require("../controllers/auth.controller");

router.get("/test", (req, res) => {
  res.send("Auth is runnig");
});

router.post("/login", login);

module.exports = router;
