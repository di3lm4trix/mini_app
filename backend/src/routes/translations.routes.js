const express = require("express");
const router = express.Router();
const {
  getTranslationsByLang,
} = require("../controllers/translations.controller");

router.get("/:lang", getTranslationsByLang);

module.exports = router;
