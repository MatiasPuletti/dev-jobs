'use strict';

const express = require('express');
const router = new express.Router();
const routeGuard = require('../middleware/route-guard');
const Job = require('./../models/job');

router.get('/', (req, res, next) => {
  Job.find()
    .populate('creator')
    .then((job) => {
      console.log(job);
      res.render('home', { job });
    })
    .catch((error) => {
      next(error);
    });
});

// Search jobs

<<<<<<< HEAD
//{ $regex: /search/i }
=======
>>>>>>> main

router.get('/search', (req, res, next) => {
  const search = req.query.search;
  const terms = search.split(' ');
  Job.find({
    // title: new RegExp('\\b' + search + '\\b', 'i')
    $and: terms.map((term) => ({
      title: new RegExp('\\b' + term + '\\b', 'i')
    }))
    // title: new RegExp('\\b' + search + '\\b', 'i')
  }).then((jobs) => {
    res.render('home', { job: jobs });
  });
  // Job.find({ title: search })
  //   .then((job) => {
  //     console.log(search);

  //     console.log(job);
  //     res.render('home', { job });
  //   })
  //   .catch((error) => {
  //     next(error);
  //   });
});

//filter jobs

const filterJavascript = document.querySelector('#check-javascript');
filterJavascript.addEventListener('change', function (e){
  if (filterJavascript.checked) {
    console.log('checkbox has been checked')
  } else {
    console.log('checkbox has NOT been checked')
  }
})

router.get('/private', (req, res, next) => {
  if (req.user) {
    res.render('private');
  } else {
    next(new Error('User is not authenticated.'));
  }
});

module.exports = router;
