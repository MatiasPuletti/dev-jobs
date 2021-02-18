'use strict';

const express = require('express');
const router = new express.Router();
const routeGuard = require('../middleware/route-guard');
const Job = require('./../models/job');

router.get('/', (req, res, next) => {
  Job.find()
    .populate('creator')
    .then((job) => {
      //console.log(job);
      res.render('home', { job });
    })
    .catch((error) => {
      next(error);
    });
});

// Search jobs multiple words

/*
router.get('/search', (req, res, next) => {
  const search = req.query.search;
  const terms = search.split(' ');
  Job.find({
    
    $and: terms.map((term) => ({
      title: new RegExp('\\b' + term + '\\b', 'i')
    }))
    
  }).then((jobs) => {
    res.render('home', { job: jobs });
  });
});
*/

//search jobs filter checkboxes

router.get('/search', (req, res, next) => {
  const search = req.query.q;
  const skillQuery = req.query.skill;
  /*let queryCond = {};

  if(skill.javascript){
    queryCond.javascript=query.javascript;
  }
  if(skill.css){
    queryCond.css=query.css;
  }
  if(skill.html){
    queryCond.html=query.html;
  }*/

  console.log(skillQuery);

  Job.find( { skill: skillQuery } )
    .then((job) => {
      //console.log(search);
      //console.log(job);
      res.render('home', { job });
    })
    .catch((error) => {
      next(error);
    });
});


router.get('/private', (req, res, next) => {
  if (req.user) {
    res.render('private');
  } else {
    next(new Error('User is not authenticated.'));
  }
});

module.exports = router;
