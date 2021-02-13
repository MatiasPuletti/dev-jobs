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
      enum: [
        'Web development',
        'Mobile apps',
        'Game development',
        'Blockchain development',
        'Cybersecurity',
        'Bug fix',
        'Chatbots'
      ],
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
      max: 30,
      required: true
    },
    image: {
      type: String
    },
    status: {
      type: String,
      enum: ['Available', 'Taken'],
      required: true
    },
    creator: {
      type: mongoose.Types.ObjectId,
      ref: 'User'
    },
    interested_user: {
      type: mongoose.Types.ObjectId,
      ref: 'Application'
    },
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
