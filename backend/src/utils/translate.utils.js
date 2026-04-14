const pool = require("../db/pool");

const translate = async (key, lang = "en") => {
  console.log("translate fue usado");
  const result = await pool.query(
    "SELECT en, sv FROM translations WHERE key = $1",
    [key],
  );
  if (!result.rows.length) return key;

  return result.rows[0][lang] || result.rows[0]["en"];
};

module.exports = translate;
