const Comment = require('../models/Comment');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

// @desc      Create a comment
// @route     POST /api/v1/projects/:projectId/comments
// @access    Private
exports.createComment = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;
  req.body.project = req.params.projectId;
  const comment = await Comment.create(req.body);

  return res.status(201).json({ success: true, data: comment });
});

// @desc      Get all comments
// @route     GET /api/v1/comments
// @access    Private
exports.getComments = asyncHandler(async (req, res, next) => {
  // const projects = await Project.find({ user: req.user.id });
  const result = res.advancedResults;
  return res.status(200).json({ success: true, data: result });
});

// @desc      Get comment
// @route     GET /api/v1/comments/:id
// @access    Private
exports.getComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next(new ErrorResponse('Resource not found', 404));
  }

  return res.status(200).json({ success: true, data: comment });
});

// @desc      Update project
// @route     PUT /api/v1/comments/:id
// @access    Private
exports.updateComment = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    msg: req.body.msg
  };

  const comment = await Comment.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
    omitUndefined: true
  });

  comment.editted = true;
  comment.lastEditDate = Date.now();
  comment.save();

  return res.status(200).json({ success: true, data: comment });
});

// @desc      Delete comment
// @route     DELETE /api/v1/comments/:id
// @access    Private
exports.deleteComment = asyncHandler(async (req, res, next) => {
  await Comment.findByIdAndDelete(req.params.id);

  return res.status(200).json({ success: true, data: {} });
});
