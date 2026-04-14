const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db/pool");
const translate = require("../utils/translate.utils");

const login = async (request, response) => {
  console.log("se recibio peticion a este endpoint, login");
  const lang = request.headers["lang"] || "en";
  const { username, password } = request.body;

  if (!username || !password) {
    const msg = await translate("missing_fields", lang);
    return response.status(400).json({ error: msg });
  }

  try {
    const result = await pool.query(
      "SELECT id, username, password_hash FROM users WHERE username = $1",
      [username],
    );

    const user = result.rows[0];

    if (!user) {
      const msg = await translate("invalid_credentials", lang);
      return response.status(401).json({ error: msg });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      const msg = await translate("invalid_credentials", lang);
      return response.status(401).json({ error: msg });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "8h" },
    );

    return response.status(200).json({
      token,
      user: { id: user.id, username: user.username },
    });
  } catch (error) {
    console.error("> LOGIN ERROR: ", error);
    const msg = await translate("server_error", lang);
    return response.status(500).json({ error: msg });
  }
};

module.exports = {
  login,
};
