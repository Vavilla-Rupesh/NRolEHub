const jwt = require('jsonwebtoken');
const User = require('../../modules/auth/auth.model');

// Middleware to verify JWT token and authenticate the user
exports.authenticate = async (req, res, next) => {
  try {

    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
    if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    
    // console.log("Authenticated");

    req.user = { id: user.id, role: user.role }; // Attach user info to the request object
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

// Middleware to authorize roles
exports.authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access forbidden: You do not have the required permissions.' });
    }
    next();
  };
};
