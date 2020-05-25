const express = require('express');
const advancedResults = require('../middleware/advancedResults');
const Comment = require('../models/Comment');

const {
  createComment, getComment, getComments, updateComment, deleteComment
} = require('../controllers/comment');
const { protect } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router.route('/')
  .get(protect, advancedResults(Comment, { path: 'comment' }, true), getComments)
  .post(protect, createComment);

router.route('/:id')
  .get(protect, getComment)
  .put(protect, updateComment)
  .delete(protect, deleteComment);

module.exports = router;
