'use strict';

const path = require('path');
const express = require('express');
const createError = require('http-errors');
const connectMongo = require('connect-mongo');
const expressSession = require('express-session');
const logger = require('morgan');
const mongoose = require('mongoose');
const sassMiddleware = require('node-sass-middleware');
const serveFavicon = require('serve-favicon');
const basicAuthenticationDeserializer = require('./middleware/basic-authentication-deserializer.js');
const bindUserToViewLocals = require('./middleware/bind-user-to-view-locals.js');
const baseRouter = require('./routes/base');
const authenticationRouter = require('./routes/authentication');
const jobRouter = require('./routes/job');
const hbs = require('hbs');

const app = express();

hbs.registerPartials('views/partials');
hbs.registerHelper('ifCond', function(v1, v2, options) {
  if (v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

hbs.registerHelper('date', require('helper-date'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(serveFavicon(path.join(__dirname, 'public/images', 'favicon.ico')));
app.use(
  sassMiddleware({
    src: path.join('styles'),
    dest: path.join(__dirname, 'public/styles'),
    prefix: '/styles',
    outputStyle:
      process.env.NODE_ENV === 'development' ? 'expanded' : 'compressed',
    force: process.env.NODE_ENV === 'development',
    sourceMap: process.env.NODE_ENV === 'development'
  })
);
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true
    },
    store: new (connectMongo(expressSession))({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60
    })
  })
);
app.use(basicAuthenticationDeserializer);
app.use(bindUserToViewLocals);

// Mount routers

app.use('/', baseRouter);
app.use('/authentication', authenticationRouter);
app.use('/job', jobRouter);

// Catch missing routes and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Catch all error handler
app.use((error, req, res, next) => {
  // Set error information, with stack only available in development
  res.locals.message = error.message;
  res.locals.error = req.app.get('env') === 'development' ? error : {};
  res.status(error.status || 500);
  res.render('error');
});



module.exports = app;
