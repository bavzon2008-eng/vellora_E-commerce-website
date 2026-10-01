const mongoose = require('mongoose');
const User = require('../models/User');
const { httpError, asyncHandler } = require('../utils/httpError');

exports.getUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json({ users });
});

exports.getUser = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) throw httpError(400, 'Invalid user ID');
  const user = await User.findById(req.params.id);
  if (!user) throw httpError(404, 'User not found');
  res.json({ user });
});
