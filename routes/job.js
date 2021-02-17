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

    let image;
    if (req.file) {
      image = req.file.path;
    }

    let skill;

    Job.create({
      title: data.title,
      category: data.category,
      description: data.description,
      skill: data.skill,
      time: data.time,
      budget: data.budget,
      image: image,
      status: data.status,
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
  const session = req.session;
  let job;
  let userIsInterested = false;
  let creatorStr;
  let sessionUserStr;

  console.log('-----------------AQUI---------------------');
  console.log(req.session);
  console.log(req.session.userId);

  /*
  if(!req.session.userId){
    console.log('!req.session.userId')
  } else {
    console.log('req.session.userId')
  }
  */

  Job.findById(id)
    .populate('creator')
    .then((doc) => {
      creatorStr = doc.creator._id.toString();
      job = doc;

      //return Promise.reject(error);
      if (job === null) {
        const error = new Error('Job does not exist.');
        error.status = 404;
        next(error);
      } else {
        Application.find({ job: id })
          .populate('interested_user')
          .then((application) => {
            if (!req.session.userId) {
              session.userId = 0;
            } else {
              sessionUserStr = session.userId.toString();
            }

            application.forEach(function (element, index) {
              //console.log(element.interested_user._id);
              //console.log(session.userId);
              //console.log(index);
              if (
                element.interested_user._id.toString() ===
                session.userId.toString()
              ) {
                userIsInterested = true;
              } else {
                userIsInterested = false;
              }
            });

            res.render('job/single', {
              job,
              application,
              userIsInterested,
              creatorStr,
              sessionUserStr
            });
          });
      }
    })
    .catch((error) => {
      if (error.kind === 'ObjectId') {
        error.status = 404;
      }
      next(error);
    });
});

router.post('/:id/interest/:interested_user', routeGuard, (req, res, next) => {
  const jobId = req.params.id;
  const data = req.body;
  const interestedUser = req.params.interested_user;

  Job.findByIdAndUpdate(jobId, {
    interested_user: interestedUser
  })
    .then((job) => {
      res.redirect(`/job/${job._id}`);
    })
    .catch((error) => {
      next(error);
    });
});

/*
router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  const sessionUserId = req.session.userId;
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
*/

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

  let skill;

  if (typeof data.skill === 'string') {
    skill = [data.skill];
  } else if (data.skill instanceof Array) {
    skill = data.skill;
  } else {
    skill = [];
  }

  Job.findByIdAndUpdate(id, {
    title: data.title,
    image: data.image || undefined,
    status: data.status,
    description: data.description,
    category: data.category,
    skill: skill,
    time: data.time,
    budget: data.budget
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

/*router.get('/:id/assign', routeGuard, (req, res, next) => {
  const id = req.params.id;
  Job.findById(id)
    .then((job) => {
      res.render('job/assign', { job: job });
    })
    .catch((error) => {
      next(error);
    });
});
*/

router.post('/:id/assign/:interested_user', routeGuard, (req, res, next) => {
  const jobId = req.params.id;
  const data = req.body;
  const assignedUser = req.params.interested_user;

  Job.findByIdAndUpdate(jobId, {
    accepted_provider: assignedUser
  })
    .then((job) => {
      res.redirect(`/job/${job._id}`);
    })
    .catch((error) => {
      next(error);
    });
});

router.post('/:id', routeGuard, (req, res, next) => {
  //console.log(req.body);
  const job = req.body.job;
  //console.log(job);
  const user = req.session.userId;
  //console.log(`user is ${user}`);

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
