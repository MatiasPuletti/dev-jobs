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
let allSearches = [];

router.get('/search', (req, res, next) => {
  const filterRoute = true;
  const search = req.query.q;
  allSearches.push(search);
  const skillQuery = req.query.skill; // console.log(skillQuery);
  const skillCheckObj = {};
  if (skillQuery) {
    if (typeof skillQuery === 'string') {
      skillCheckObj[skillQuery] = true;
    } else {
      skillQuery.forEach((item) => (skillCheckObj[item] = true));
    }
  }
  // /* eslint-disable no-param-reassign */
  // let skillCheckObj = skillCheck.reduce(function (o, val) {
  //   o[val] = val;
  //   return o;
  // }, {});
  // /* eslint-enable no-param-reassign */
  const terms = search.split(' ');
  Job.find({
    $and: [
      {
        $and: terms.map((term) => ({
          title: new RegExp('\\b' + term + '\\b', 'i')
        }))
      },
      skillQuery ? { skill: { $in: skillQuery } } : {}
    ]
  })
    /*$and: terms.map((term) => ({
      title: new RegExp('\\b' + term + '\\b', 'i')
    }))
    ,skill: { $in: skillQuery }
    */
    .populate('creator')
    .then((jobs) => {
      // console.log(skillCheck);
      console.log(skillCheckObj);
      res.render('home', {
        job: jobs,
        search,
        filterRoute,
        allSearches,
        skillCheckObj
      });
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
