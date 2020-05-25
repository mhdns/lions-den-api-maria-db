const bcrypt = require('bcryptjs');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

// Helper: Issue Token and Cookie
const issueToken = (user, statusCode, res) => {
  // Generate token
  const token = user.signJWT();

  // Cookie options
  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }
  res.status(statusCode)
    .cookie('token', token, options)
    .json({ success: true, data: token });
};


// @desc      Register a user
// @route     POST /api/v1/auth/register
// @access    Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    next(new ErrorResponse('Please enter all fields', 400));
  }

  const user = await User.create({ name, email, password });
  return issueToken(user, 201, res);
});

// @desc      User Login
// @route     POST /api/v1/auth/login
// @access    Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorResponse('Please enter a email and password', 400));
  }

  // Get user
  const user = await User.findOne({ email: email.toLowerCase() }, 'email password');

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new ErrorResponse('Invalid Credentials', 400));
  }

  return issueToken(user, 200, res);
});

// @desc      Get Current Logged in User
// @route     GET /api/v1/auth/me
// @access    Private
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate('projects');
  res.status(200).json({ success: true, data: user });
});

// @desc      Update User Details
// @route     PUT /api/v1/auth/updatedetail
// @access    Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const { id } = req.user;
  const fieldsToUpdate = {
    name: req.body.name
  };
  const user = await User.findByIdAndUpdate(id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  return res.status(200).json({ success: true, data: user });
});

// @desc      Update User Password
// @route     PUT /api/v1/auth/updatepassword
// @access    Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const { id } = req.user;

  const user = await User.findById(id).select('+password');
  // Check password
  if (!(await bcrypt.compare(req.body.oldPassword, user.password))) {
    return next(new ErrorResponse('Password is incorrect', 401));
  }

  user.password = req.body.newPassword;
  await user.save({ validateBeforeSave: false });

  return issueToken(user, 200, res);
});

// @desc      Delete User
// @route     Delete /api/v1/auth/deleteuser
// @access    Private
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  user.remove();
  res.status(200).json({ success: true, data: {} });
});


// @desc      Logout user and clear cookies
// @route     GET /api/v1/auth/logout
// @access    Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', '', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  return res.status(200).json({
    success: true,
    data: {}
  });
});
