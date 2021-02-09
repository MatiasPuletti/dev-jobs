'use strict';

const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: String,
      required: true
    },
    interested_user: {
      type: String
    }
  },
  {
    timestamps: {
      createdAt: 'creationDate',
      updatedAt: 'updateDate'
    }
  }
);

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;

/*

job: {
      type: mongoose.Types.ObjectId,
      ref: 'Job'
    },
    interested_providers: [
      {
      type: mongoose.Types.ObjectId,
      ref: 'User'
      }
    ],
    accepted_provider: {
      type: mongoose.Types.ObjectId,
      ref: 'User'
    },


*/
