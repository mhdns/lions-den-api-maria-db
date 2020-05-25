const express = require('express');
const advancedResults = require('../middleware/advancedResults');
const Project = require('../models/Project');

const {
  createProject, getProjects, getProject, updateProject, deleteProject
} = require('../controllers/project');
const { protect } = require('../middleware/auth');

const router = express.Router();

const commentsRouter = require('./comment');

router.use('/:projectId/comments', commentsRouter);

router.route('/')
  .get(protect, advancedResults(Project, { path: 'projects' }, true), getProjects)
  .post(protect, createProject);

router.route('/:id')
  .get(protect, getProject)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

module.exports = router;
