'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  firstname: {
    type: String,
    trim: true
  },
  lastname: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  image: {
    type: String
  },
  userType: {
    type: String,
    enum: ['publisher', 'provider'],
    required: true
  },
  passwordHashAndSalt: {
    type: String
  }
});

module.exports = mongoose.model('User', schema);
