// import the jsonwebtoken library to decode tokens
const jwt = require("jsonwebtoken");

// function to verify tokens
const verifyToken = (request, response, next) => {
  // get the header of the petition
  const authHeader = request.headers["authorization"];

  // verify if the header includes a token, and the token starts with the word Bearer
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // return a error if the token not exists
    return response.status(401).json({ error: "Token is required" });
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
    // capture the error
    // return a error code
    return response.status(401).json({ err: "Invalid token or expired" });
  }
};
