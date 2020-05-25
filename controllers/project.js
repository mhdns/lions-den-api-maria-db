const Project = require('../models/Project');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

// @desc      Create a project
// @route     POST /api/v1/projects
// @access    Private
exports.createProject = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;

  const project = await Project.create(req.body);

  return res.status(201).json({ success: true, data: project });
});

// @desc      Get all projects
// @route     GET /api/v1/projects or /api/v1/auth/:id/projects
// @access    Private
exports.getProjects = asyncHandler(async (req, res, next) => {
  // const projects = await Project.find({ user: req.user.id });
  const result = res.advancedResults;
  return res.status(200).json({ success: true, data: result });
});

// @desc      Get project
// @route     GET /api/v1/projects/:id or /api/v1/auth/:id/projects/:id
// @access    Private
exports.getProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(new ErrorResponse('Resource not found', 404));
  }

  return res.status(200).json({ success: true, data: project });
});

// @desc      Update project
// @route     PUT /api/v1/projects/:id or /api/v1/auth/:id/projects/:id
// @access    Private
exports.updateProject = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    description: req.body.description
  };

  const project = await Project.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
    omitUndefined: true
  });

  return res.status(200).json({ success: true, data: project });
});

// @desc      Delete project
// @route     DELETE /api/v1/projects/:id or /api/v1/auth/:id/projects/:id
// @access    Private
exports.deleteProject = asyncHandler(async (req, res, next) => {
  await Project.findByIdAndDelete(req.params.id);

  return res.status(200).json({ success: true, data: {} });
});
