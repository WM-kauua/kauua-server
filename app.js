const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const passport = require('./server/authentication').passport;
const errorMessage = require('./server/assets/error_message');

const app = express();

if(process.env.MOCHA_REPORTER && process.env.MOCHA_REPORTER !== 'nyan'){
  app.use(logger('dev'));
}

app.use(passport.initialize());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

// public directory to expose whatever :
//app.use(express.static(path.join(__dirname, 'fileSytemExposure')));
//console.log(__dirname);

// serve angular as static files:
app.use(express.static(path.join(__dirname, 'dist')));

// start of routing 
require(__dirname+'/./server/routes')(app);

// send app to modules routing
//require(__dirname+'/./server/modules')(app);

app.use(function(error,request,response,next){
  
  if(error.statusCode === '400'){
    response.status(400).json({ error: errorMessagejsonTrouble });
  }
  next();
});

module.exports = app;


