const jsonwebtoken = require('jsonwebtoken');
const JWT_SECRET = require('../utils/CONSTANTS');
const Error = require('../utils/Error');

const fetchUserIdFromToken = (req, res, next) => {
  try {
    const token = req.header('auth-token')
    if(!token) {
      res.send(401).send(new Error("Authentication", "Please Authenticate with a valid token"))
    }
    const data = jsonwebtoken.verify(token, JWT_SECRET)
    req.user = data.user;
    next();
  } catch(err) {
    res.status(500).send(err)
  }
}

module.exports = fetchUserIdFromToken; 