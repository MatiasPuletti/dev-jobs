'use strict';

const express = require('express');
const router = new express.Router();
const routeGuard = require('../middleware/route-guard');
const Job = require('../models/job');
const Application = require('../models/application');
const uploadMiddleware = require('./../middleware/file-upload');


router.get('/create', routeGuard, (req, res, next) => {
  res.render('job/create');
});

router.post(
  '/create',
  routeGuard,
  uploadMiddleware.single('image'),
  (req, res, next) => {
    const data = req.body;

    let skill;

    if (typeof data.skill === 'string') {
      skill = [data.skill];
    } else if (data.skill instanceof Array) {
      skill = data.skill;
    } else {
      skill = [];
    }

    let image;
    if (req.file) {
      image = req.file.path;
    }

    Job.create({
      title: data.title,
      category: data.category,
      skill: skill,
      time: data.time,
      budget: data.budget,
      image: image,
      creator: req.user._id
    })
      .then((job) => {
        res.redirect(`/job/${job._id}`);
      })
      .catch((error) => {
        next(error);
      });
  }
);

router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  const sessionUserId = req.session.userId
  let job;
  let sessionUserIsInterested = false;
  Job.findById(id)
    .then((doc) => {
      job = doc;
      if (job === null) {
        const error = new Error('Job does not exist.');
        error.status = 404;
        next(error);
      } else {
        Application.find({ "job": id })
          .populate('interested_user')
          .then((application) => {

            application.forEach(function (arrayItem) {
              if (interested_user === sessionUserId) {
                console.log("they´re equal");
                sessionUserIsInterested = true
              } else {
                sessionUserIsInterested = false
              } 
              res.render('job/single', { job: job, application: application, sessionUserId: sessionUserId });
            });
          })
        }
      })
  .catch((error) => {
    if (error.kind === 'ObjectId') {
      error.status = 404;
    }
    next(error);
  });
});

router.get('/:id/update', routeGuard, (req, res, next) => {
  const id = req.params.id;
  Job.findById(id)
    .then((job) => {
      res.render('job/update', { job: job });
    })
    .catch((error) => {
      next(error);
    });
});

router.post('/:id/update', routeGuard, (req, res, next) => {
  const id = req.params.id;
  const data = req.body;
  Job.findByIdAndUpdate(id, {
    title: data.title,
    image: data.image || undefined
  })
    .then((job) => {
      res.redirect(`/job/${job._id}`);
    })
    .catch((error) => {
      next(error);
    });
});

router.get('/:id/delete', routeGuard, (req, res, next) => {
  const id = req.params.id;
  Job.findById(id)
    .then((job) => {
      res.render('job/confirm-deletion', { job: job });
    })
    .catch((error) => {
      next(error);
    });
});

router.post('/:id/delete', routeGuard, (req, res, next) => {
  const id = req.params.id;
  Job.findByIdAndDelete(id)
    .then(() => {
      res.redirect('/');
    })
    .catch((error) => {
      next(error);
    });
});

router.post('/:id', routeGuard, (req, res, next) => {
  console.log(req.body);
  const job = req.body.job;
  console.log(job);
  const user = req.session.userId;
  console.log(`user is ${user}`);

  Application.create({
    job: job,
    interested_user: user
  })
    .then((application) => {
      res.redirect(`/job/${job}`);
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
