const User = require('../models/User');
const { signToken } = require('../utils/token');
const { httpError, asyncHandler } = require('../utils/httpError');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const STRONG_PW = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  if (!name || !email || !password) throw httpError(400, 'Name, email and password are required');
  if (String(name).trim().length < 2) throw httpError(400, 'Name must be at least 2 characters');
  if (!EMAIL_RE.test(String(email))) throw httpError(400, 'Enter a valid email address');
  if (!STRONG_PW.test(String(password))) {
    throw httpError(400, 'Password must be 8+ characters with an uppercase letter, a lowercase letter and a number');
  }
  if (confirmPassword !== undefined && confirmPassword !== password) throw httpError(400, 'Passwords do not match');

  const exists = await User.findOne({ email: String(email).toLowerCase().trim() });
  if (exists) throw httpError(400, 'An account with this email already exists');

  // role is never taken from the request body: every public signup is a customer
  const user = await User.create({ name, email, password, role: 'user' });
  res.status(201).json({ token: signToken(user._id), user });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw httpError(400, 'Email and password are required');
  const user = await User.findOne({ email: String(email).toLowerCase().trim() }).select('+password');
  if (!user || !(await user.matchPassword(String(password)))) throw httpError(401, 'Incorrect email or password');
  res.json({ token: signToken(user._id), user });
});

exports.me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

exports.updateMe = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;
  if (name !== undefined) {
    if (String(name).trim().length < 2) throw httpError(400, 'Name must be at least 2 characters');
    req.user.name = name;
  }
  if (phone !== undefined) {
    if (phone && !/^[0-9+\-\s]{7,15}$/.test(phone)) throw httpError(400, 'Enter a valid phone number');
    req.user.phone = phone;
  }
  await req.user.save();
  res.json({ user: req.user });
});
