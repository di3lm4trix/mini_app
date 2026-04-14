const express = require("express");
const router = express.Router();

router.get("/test", (req, res) => {
  res.send("Products is runnig");
});

module.exports = router;
