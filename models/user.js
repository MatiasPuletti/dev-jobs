'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  firstname: {
    type: String,
    trim: true,
    required: true
  },
  lastname: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  location: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
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
