const pool = require("../db/pool");
const translate = require("../utils/translate.utils");

const getTranslationsByLang = async (request, response) => {
  const { lang } = request.params;
  const supportedLangs = ["en", "sv"];

  if (!supportedLangs.includes(lang)) {
    return response.status(400).json({
      error: "Unsoported languaje. Use: en, sv",
    });
  }

  try {
    const result = await pool.query(`
        SELECT key, ${lang} AS value FROM translations
    `);
    const translations = result.rows.reduce((acc, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {});

    return response.status(200).json(translations);
  } catch (error) {
    console.error("getTranslationsByLang error:", error);
    const msg = await translate("server_error", lang);
    return response.status(500).json({ error: msg });
  }

  console.log("one translation is required");
};

module.exports = { getTranslationsByLang };
