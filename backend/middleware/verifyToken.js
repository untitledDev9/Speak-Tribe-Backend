const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1. Check if token is provided
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }


  const token = authHeader.split(' ')[1];

  try {
    // 2. Verify token using secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Attach decoded user info to request object
    req.user = decoded;

    next(); // move to the next middleware/controller
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = verifyToken;
