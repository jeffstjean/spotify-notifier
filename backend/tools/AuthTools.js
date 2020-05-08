const jwt = require("jsonwebtoken");

module.exports.CheckAuthorized = function(req, res, next) {
  const token = req.cookies ? req.cookies.authorization : null;
  if (!token) return res.status(401).send('Unauthorized')
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  }
  catch(e) {
    res.status(401).send('InvalidToken');
  }
}
