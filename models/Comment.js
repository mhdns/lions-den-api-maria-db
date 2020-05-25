const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
  msg: {
    type: String,
    required: [true, 'Please enter a message']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  project: {
    type: mongoose.Schema.ObjectId,
    ref: 'Project',
    required: true
  },
  editted: {
    type: Boolean,
    default: false
  },
  lastEditDate: {
    type: Date
  }
});

module.exports = mongoose.model('Comment', CommentSchema);
