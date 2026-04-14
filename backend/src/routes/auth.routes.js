const express = require("express");
const router = express.Router();

router.get("/test", (req, res) => {
  res.send("Auth is runnig");
});

module.exports = router;
