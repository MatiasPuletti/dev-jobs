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

router.get('/search', (req, res, next) => {
  const search = req.query.q;
  const skillQuery = req.query.skill || [
    'javascript',
    'css',
    'html',
    'mongodb',
    'canvas',
    'react',
    'vue'
  ];
  // console.log(skillQuery);
  const terms = search.split(' ');
  Job.find({
    $or: [
      {
        $and: [
          { title: search }
          //{ title: 'test' },
        ]
      },
      {
        $or: [{ skill: skillQuery }]
      }
    ]
  })

    /*$and: terms.map((term) => ({
      title: new RegExp('\\b' + term + '\\b', 'i')
    }))
    ,skill: { $in: skillQuery }
    */
    .then((jobs) => {
      res.render('home', { job: jobs, search });
    });
});

//search jobs filter checkboxes
/*
router.get('/filter', (req, res, next) => {
  console.log(searchQuery);
  console.log(skillQuery);
  console.log(searchResults);
  const search = req.body.q;
  console.log("HERE",search)
  const skills = ['css', 'html', 'mongodb'];
  const terms = search.split(' ');
  // const skillQuery = req.query.skill || [];
  // console.log(skillQuery);
  let ze = terms.map((term) => ({
    title: new RegExp('\\b' + term + '\\b', 'i')
  }));
  //let dan = `, skill: [${skills}]`;
  let dan = skills;
  let full = ze + dan;
  console.log(ze);
  console.log(dan);
  console.log(full);

  Job.find({
    $and: terms.map((term) => ({
      title: new RegExp('\\b' + term + '\\b', 'i')
    }))
    //,
    //skill: { $in: skillQuery }
  }).then((jobs) => {
    res.render('home', { job: jobs });
    searchResults = jobs;
  });
});
*/
router.get('/private', (req, res, next) => {
  if (req.user) {
    res.render('private');
  } else {
    next(new Error('User is not authenticated.'));
  }
});

module.exports = router;
