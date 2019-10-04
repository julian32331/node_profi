var createError = require('http-errors');
var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var engine = require('ejs-locals');
var router = require('./routes');
var passport = require('passport');
require('./config/passport')(passport);
var flash = require('connect-flash');
var session = require('express-session');
var app = express();
require('dotenv').config();

const MONGOURL = process.env.MONGODB_URI || 'mongodb://localhost/profi';

mongoose.connect(MONGOURL, { useNewUrlParser: true }, err => {
  console.error(err || `Connected to MongoDB: ${MONGOURL}`);
});

// view engine setup
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json({
  limit: '500mb', extended: true
}));
app.use(cookieParser());

app.use(express.static("public"));

//passport
app.use(session({
  secret: 'dantickets',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/', router);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.render('404');
});

module.exports = app;
