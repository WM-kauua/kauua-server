'use strict'

/**
 *  Index.js factor a function which take the app express and route the path
 */

const path = require('path');
const userController = require(__dirname+'/../controllers').user;
const moduleController = require(__dirname+'/../controllers').kawamodule;
const kawaserverController = require(__dirname+'/../controllers').kawaserver;

const passport = require('../authentication').passport;
module.exports = (app) => {

  require('../filters')(app);

  // 
  //  |   
  //  | falling through 
  //  |
  //

  app.get('/api', (request,response) => {
    return response.status(200).json({ message: "Welcome to the api" });
  });

  // User related

  app.post('/api/user', userController.create);
  app.post('/api/login', userController.authenticate);
 
  app.put('/api/user/:userId', 		passport.authenticate('jwt', { session:false }),	userController.update);
  app.get('/api/user',  		passport.authenticate('jwt', { session:false }), 	userController.list);
  app.get('/api/privileges',	      	passport.authenticate('jwt', { session:false }),	userController.getPrivileges);
  app.get('/api/user/:userId', 		passport.authenticate('jwt', { session:false }),	userController.retrieve);
  app.delete('/api/user/:userId', 	passport.authenticate('jwt', { session:false }), 	userController.delete);
  app.put('/api/login', 		passport.authenticate('jwt', { session:false }),	userController.refreshToken);
  app.delete('/api/login',		passport.authenticate('jwt', { session:false }),        userController.logOff);
  app.get('/api/server', 		passport.authenticate('jwt', { session:false }),	kawaserverController.getInfo);
  app.post('/api/server',		passport.authenticate('jwt', { session:false }),	kawaserverController.setInfo);
  app.delete('/api/server',		passport.authenticate('jwt', { session:false }),	kawaserverController.reset);

  // comment me
  app.post('/api/user/admin', 	passport.authenticate('jwt', { session: false }),	userController.setAdmin);
  
  // KawaModule related :
  app.put('/api/test_install', 		passport.authenticate('jwt', { session:false }),	moduleController.test_install);
  app.get('/api/modules', 		passport.authenticate('jwt', { session:false }),	moduleController.getModules);
  app.put('/api/insertKModule/:kawaModuleName', passport.authenticate('jwt', { session: false }), moduleController.insertModule);
  app.put('/api/associateKModule/:kawaModuleName', passport.authenticate('jwt', { session: false }), moduleController.associateModule);
  app.delete('/api/unAssociateKModule/:kawaModuleName',passport.authenticate('jwt', { session: false }), moduleController.unAssociateModule);
  // module routes :

  require('../modules')(app);

  // send angular frontend
  app.use('*', (request,response) => {
    response.sendFile(path.join(__dirname, 'dist/index.html'))
  });

}
