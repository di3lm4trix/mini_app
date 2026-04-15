// import the jsonwebtoken library to decode tokens
const jwt = require("jsonwebtoken");
const translate = require("../utils/translate.utils");

// function to verify tokens
const verifyToken = async (request, response, next) => {
  const lang = request.headers["lang"] || "en";
  // get the header of the petition
  const authHeader = request.headers["authorization"];

  // verify if the header includes a token, and the token starts with the word Bearer
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const msg = await translate("token_required", lang);
    // return a error if the token not exists
    return response.status(401).json({ error: msg });
  }

  // the header structure is Bearer this_is_the_jwt_token
  // split eliminate the spaces, and using [1] we select the second oration
  const token = authHeader.split(" ")[1];

  // use try to capture the erros
  try {
    // verify the token using the jwt library
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // insert the decodified token to use in another middleware
    request.user = decoded; //id, username, iat, exp
    next();
  } catch (err) {
    const isExpired = err.name === "TokenExpiredError";
    const key = isExpired ? "token_expired" : "token_invalid";
    const msg = await translate(key, lang);
    // capture the error
    // return a error code
    return response.status(401).json({ err: msg });
  }
};

module.exports = { verifyToken };
