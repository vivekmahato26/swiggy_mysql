const CryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.get("Authorization"); //Bearer <token>
    if (!authHeader) {
      throw new Error("Authorization missing");
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new Error("Token missing");
    }
    const decryptedString = CryptoJs.AES.decrypt(
      token,
      process.env.TOKEN_SECRET
    ).toString(CryptoJs.enc.Utf8);

    const tokenData = JSON.parse(decryptedString);
    req.isAuth = true;
    req.userId = tokenData.id;
    req.email = tokenData.email;
    return next();

    // const verifyToken = jwt.verify(token,process.env.TOKEN_SECRET)
    // if(!verifyToken || !verifyToken.id) {
    //     throw new Error("Invalid token")
    // }
    // req.isAuth = true;
    // req.userId = verifyToken.id;
    // req.email = verifyToken.email
    // return next()
  } catch (error) {
    // console.log(error);
    req.isAuth = false;
    return next();
  }
};
