// const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter a name.']
  },
  email: {
    type: String,
    match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    validate: {
      async validator(value) {
        const count = await this.model('User').countDocuments({ email: value.toLowerCase() });
        return count === 0;
      },
      message: 'User already exists'
    }
  },
  role: {
    type: String,
    enum: ['client', 'dev', 'admin'],
    default: 'client'
  },
  password: {
    type: String,
    required: [true, 'Please enter a password.'],
    minlength: 8,
    select: false
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Password Encryption
UserSchema.pre('save', async function (next) {
  if (!this.isModified) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  this.email = this.email.toLowerCase();
});

// JWT
UserSchema.methods.signJWT = function () {
  return jwt.sign({ id: this._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE });
};

// Cascade delete courses when Bootcamp is deleted
UserSchema.pre('remove', async function (next) {
  await this.model('Project').deleteMany({ user: this._id });
  next();
});

// Reverse populate with virtuals
UserSchema.virtual('projects', {
  ref: 'Project',
  localField: '_id',
  foreignField: 'user',
  justOne: false
});

module.exports = mongoose.model('User', UserSchema);
