const pool = require("../db/pool");
const translate = require("../utils/translate.utils");

const getAllProducts = async (request, response) => {
  const lang = request.headers["lang"] || "en";

  try {
    const result = await pool.query(
      "SELECT id, name_key, buy_price, sell_price FROM products ORDER BY id ASC",
    );
    return response.status(200).json(result.rows);
  } catch (error) {
    console.error("getAllProducts error: ", error);
    const msg = await translate("server_error", lang);
    return response.status(500).json({ error: msg });
  }
};

const updateProduct = async (request, response) => {
  const lang = request.headers["lang"] || eng;
  const { id } = request.params;
  const { buy_price, sell_price } = request.body;

  if (buy_price === underfined || sell_price === underfined) {
    const msg = await translate("missing_price_fields", lang);
    return response.status(400).json({ error: msg });
  }

  if (isNaN(Number(buy_price)) || isNaN(Number(sell_price))) {
    const msg = await translate("invalid_price_format", lang);
    return response.status(400).json({ error: msg });
  }

  if (Number(buy_price) < 0 || Number(sell_price) < 0) {
    const msg = await translate("negative_price", lang);
    return response.status(400).json({ error: msg });
  }

  try {
    const result = await pool.query(
      `
      UPDATE products
      SET buy_price = $1, sell_price = $2
      WHERE id = $3
      RETURNING id, name_key, buy_price, sell_price
      `,
      [buy_price, sell_price, id],
    );

    if (result.rows.length === 0) {
      const msg = await translate("product_not_found", lang);
      return response.status(404).json({ error: msg });
    }

    const msg = await translate("saved_ok", lang);

    return response.status(200).json({
      message: msg,
      product: result.rows[0],
    });
  } catch (error) {
    console.error("updateProduct error: ", error);
    const msg = await translate("server_error", lang);
    return response.status(500).json({ error: msg });
  }
};

module.exports = { getAllProducts, updateProduct };
