const jwt = require("jsonwebtoken");
const config = require("config");
const moment = require("moment");

function verifyToken(token) {
  try {
    let decoded = jwt.verify(token, config.get("jwtSettings").privateKey, {
      ignoreExpiration: true,
    });
    if (decoded.expAt < moment().unix()) {
      return {
        verified: false,
      };
    }
    return {
      verified: true,
      data: decoded,
    };
  } catch (error) {
    console.log(error)
    return {
      verified: false,
    };
  }
}

function authenticateUser(req, res, next) {
  let token = req?.header("Authorization");
  if (!token) {
    return res
      .status(401)
      .json({ response: false, message: "Token not found" });
  } else {
    token = token.split(" ")[1];
    let result = verifyToken(token);
    if (!result.verified) {
      return res.status(403).json({ response: false, message: result.error });
    } else {
      req.user = result.data;
      req.authenticated = true;
      next();
    }
  }
}

function checkPermission() {
    return (req, res, next) => authenticateUser(req, res, next);
  }

module.exports = {
  authenticateUser,
  verifyToken,
  checkPermission
};
