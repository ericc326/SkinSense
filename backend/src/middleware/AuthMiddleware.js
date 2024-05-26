const User = require("../models/UserModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.userVerification = (req, res) => {
  const token = req.cookies.token
  if (!token) {
    console.log("Token not found in cookies");
    return res.json({ status: false })
  }
  jwt.verify(token, `${process.env.TOKEN_SECRET}`, async (err, data) => {
    if (err) {
     console.log("JWT verification failed:", err.message);
     return res.json({ status: false })
    } else {
      const user = await User.findById(data.id)
      if (user) return res.json({ status: true, user: user.username })
      else return res.json({ status: false })
    }
  })
}