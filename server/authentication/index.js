'use strict';

const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const extractJWT = passportJWT.ExtractJwt;
const strategyJWT = passportJWT.Strategy;

const secretJWT = "je suis un secret";
const models = require('../models');
const User = models.User;

var optionsJWT = {};
optionsJWT.jwtFromRequest = extractJWT.fromAuthHeaderAsBearerToken();
optionsJWT.secretOrKey = secretJWT ;

/**
 * @property kawaStrategy - Applied strategy to passport ; 
 *    retrieve the user from the database with the id retrieved from the
 *    token payload.
 */

let kawaStrategy = new strategyJWT(optionsJWT, function(jwtPayload, done){
  return User.findById(jwtPayload.id)
    .then( user => {
      if(user){
        return done(null,user);
      }else{
        return done(null,false);
      }
    })
    .catch( error => {
      return done(error,false);
    });
});

passport.use(kawaStrategy);

module.exports={
  passport,
  optionsJWT
};
