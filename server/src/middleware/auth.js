const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const hdr = req.headers.authorization || '';
  const [type, token] = hdr.split(' ');
  if (type !== 'Bearer' || !token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = { authMiddleware };
