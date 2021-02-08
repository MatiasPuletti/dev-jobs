'use strict';

const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ['book', 'video', 'article', 'blog', 'tweet', 'podcast', 'course'],
      required: true
    },
    skill: [
      {
        type: String,
        enum: [
          'javascript',
          'css',
          'html',
          'mongodb',
          'canvas',
          'react',
          'vue',
          'angular',
          'jquery',
          'express',
          'php',
          'java',
          'python',
          'node',
          'rails',
          'ruby'
        ]
      }
    ],
    budget: {
      type: Number
    },
    time: {
      type: Number,
      min: 1,
      max: 10,
      required: true,
      default: 3
    },
    image: {
      type: String
    },
    creator: {
      type: mongoose.Types.ObjectId,
      ref: 'User'
    },
    interested_providers: [
      {
            type: mongoose.Types.ObjectId,
            ref: 'Application'
      }
      ],
      accepted_provider: {
            type: mongoose.Types.ObjectId,
            ref: 'Application'
      },
    comments: [
      {
        message: {
          type: String,
          required: true
        },
        creator: {
          type: mongoose.Types.ObjectId,
          required: true,
          ref: 'User'
        },
        Job: {
          type: mongoose.Types.ObjectId,
          required: true,
          ref: 'Job'
        }
      }
    ]
  },
  {
    timestamps: {
      createdAt: 'creationDate',
      updatedAt: 'updateDate'
    }
  }
);

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
