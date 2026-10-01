const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { httpError, asyncHandler } = require('../utils/httpError');

// Step 1: verify the JWT. Step 2: load the authenticated user.
const protect = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) throw httpError(401, 'Please log in to continue');
  const token = header.split(' ')[1];
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    throw httpError(401, e.name === 'TokenExpiredError' ? 'Your session has expired. Please log in again' : 'Invalid session. Please log in again');
  }
  const user = await User.findById(payload.id);
  if (!user) throw httpError(401, 'This account no longer exists');
  req.user = user;
  next();
});

// Step 3: verify the admin role (always used after protect).
const adminOnly = (req, _res, next) => {
  if (!req.user || req.user.role !== 'admin') return next(httpError(403, 'Admin access required'));
  next();
};

module.exports = { protect, adminOnly };
