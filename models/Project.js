const mongoose = require('mongoose');

const ProjectSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter a project name']
  },
  stub: {
    type: String
  },
  description: {
    type: String,
    required: [true, 'Please enter a description']
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  projectType: {
    type: String,
    enum: ['application', 'feature'],
    default: 'application'
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

ProjectSchema.pre('save', function (next) {
  if (this.isModified) {
    next();
  }
  this.stub = `${this.createdAt}_${this.name}`;
});

module.exports = mongoose.model('Project', ProjectSchema);
