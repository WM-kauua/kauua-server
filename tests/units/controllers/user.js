'use strict'

const chai = require('chai');
const httpMocks = require('node-mocks-http');
const models = require('../../../server/models');
const User = models.User;
const sequelize = models.sequelize;
const controllers = require('../../../server/controllers');
const userController = controllers.user;
const expect = chai.expect;

const user_name = "legitName";
const user_too_short_name = "ab";
const user_not_alphaNum_name = "_6--";
const user_password = "password";
const user_too_short_password = "12345" ;
const user_updated_name="updatedLegitName";
const user_name_script="<script>alert(1)</script>";

const errorMessage = require('../../../server/assets/error_message');

let user_inserted_id ;
let user_token ;

describe('User controller', function() {
  this.timeout(3000);
  let request, response, parsed_response ;
 
  before(function(){
    return sequelize.sync({ force: true });
  });

  beforeEach(function(){
    response = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });
  });

  // controller should not break the models behaviour 

  it('should reject  a create request with a null name', function(done){
    request = httpMocks.createRequest({
      method: 'POST',
      url: '/api/user',
      body: {
        name: null, 
        password: user_password 
      }
    })
    
    userController.create(request,response);
    
    response.on('end', function(){
      expect(response.statusCode).to.equal(400);
      parsed_response = JSON.parse(response._getData());
      expect(parsed_response.error).to.equal(errorMessage.badRequest);
      done();
    });
  });

  it('should reject a create request with an empty name', function(done){
    request = httpMocks.createRequest({
      method: 'POST',
      url: '/api/user',
      body:{
        name: "   ",
        password: user_password
      }
    });
   
    userController.create(request,response);

    response.on('end', function(){
      expect(response.statusCode).to.equal(400);
      parsed_response = JSON.parse(response._getData());
      expect(parsed_response.error).to.equal(errorMessage.badRequest);
      done();
    });
  });

  it('should reject a create request with a too short user name', function(done){
    request = httpMocks.createRequest({
      method: 'POST',
      url: '/api/user',
      body:{
        name: user_too_short_name,
        password: user_password
      }
    });

    userController.create(request,response);

    response.on('end', function(){
      expect(response.statusCode).to.equal(400);
      parsed_response = JSON.parse(response._getData());
      expect(parsed_response.error).to.equal(errorMessage.badRequest);
      done();
    });
  });

  it('should reject a create request with a not alphanumeric user name', function(done){
    request = httpMocks.createRequest({
      method: 'POST',
      url: '/api/user',
      body:{
        name: user_not_alphaNum_name,
        password: user_password
      }
    });

    userController.create(request,response);

    response.on('end', function(){
      expect(response.statusCode).to.equal(400);
      parsed_response = JSON.parse(response._getData());
      expect(parsed_response.error).to.equal(errorMessage.badRequest);
      done();
    });
  });

  it('should reject a create request with a null password', function(done){
    request = httpMocks.createRequest({
      method: 'POST',
      url: '/api/user',
      body:{
        name: user_name,
        password: null
      }
    });

    userController.create(request,response);

    response.on('end', function(){
      expect(response.statusCode).to.equal(400);
      parsed_response = JSON.parse(response._getData());
      expect(parsed_response.error).to.equal(errorMessage.badRequest);
      done();
    });
  });

  it('should reject a create request with an empty password', function(done){
    request = httpMocks.createRequest({
      method: 'POST',
      url: '/api/user',
      body:{
        name: user_name,
        password: "       "
      }
    });

    userController.create(request,response);

    response.on('end', function(){
      expect(response.statusCode).to.equal(400);
      parsed_response = JSON.parse(response._getData());
      expect(parsed_response.error).to.equal(errorMessage.badRequest);
      done();
    });
  });

  it('should reject a create request with an too short password', function(done){
    request = httpMocks.createRequest({
      method: 'POST',
      url: '/api/user',
      body:{
        name: user_name,
        password: user_too_short_password
      }
    });

    userController.create(request,response);

    response.on('end', function(){
      expect(response.statusCode).to.equal(400);
      parsed_response = JSON.parse(response._getData());
      expect(parsed_response.error).to.equal(errorMessage.badRequest);
      done();
    });
  });

  // it finally should create a user 
  it('should accept a create request for a legit user name and password', function(done){
  request = httpMocks.createRequest({
      method: 'POST',
      url: '/api/user',
      body:{
        name: user_name,
        password: user_password,
        admin: true
      }
    });

    userController.create(request,response);

    response.on('end', function(){
      expect(response.statusCode).to.equal(201);
      parsed_response = JSON.parse(response._getData());
      expect(parsed_response.name).to.equal(user_name);
      user_inserted_id = parsed_response.id;
      done();
    });
  });

  it('should reject a create request for the same name as username', function(done){
  request = httpMocks.createRequest({
      method: 'POST',
      url: '/api/user',
      body:{
        name: user_name,
        password: user_password,
        admin: true
      }
    });

    userController.create(request,response);

    response.on('end', function(){
      expect(response.statusCode).to.equal(400);
      parsed_response = JSON.parse(response._getData());
      expect(parsed_response.error).to.equal(errorMessage.nameAlreadyPresent);
      done();
    });
  });


  // ------     END OF CREATE TESTS  
  //
  //   with that usr now in the database
  //

  it('should authenticate a legit user', function(done){
    request = httpMocks.createRequest({
      method: 'POST',
      url: '/api/login',
      body: {
        name: user_name,
        password: user_password
      }
    })

    userController.authenticate(request,response);

    response.on('end',function(){
      expect(response.statusCode).to.equal(200);
      parsed_response = JSON.parse(response._getData());
      expect(parsed_response).to.have.key('token');
      user_token = parsed_response.token;
      done();
    });
  });

  // ------     THE CONTROLLER USE TOKEN TO STORE ID
  // ------    THEN AS IT INTEGRATES IT CANNOT BE UNIT TEST ON UPDATE AND DELETE

  it('should reject an update request with no token', function(done){
    request = httpMocks.createRequest({
      method: 'PUT',
      url: '/api/user/1',
      body: {
        name: user_updated_name,
        password: user_password
      },
      params: {
        userId: user_inserted_id
      }
    });
    userController.update(request,response);
        
    response.on('end',function(){
      expect(response.statusCode).to.equal(500);
      expect(JSON.parse(response._getData()).error).to.equal(errorMessage.server);
      done();
    });
  });

  it('should reject a delete request with no token', function(done){
    request = httpMocks.createRequest({
      method: 'DELETE',
      url: '/api/user/'+user_inserted_id,
      params:{
        userId: user_inserted_id
      }
    });

    userController.delete(request,response);

    response.on('end',function(){
      expect(response.statusCode).to.equal(500);
      expect(JSON.parse(response._getData()).error).to.equal(errorMessage.server);
      done();
    });
  });

// ------  LIST DOESNT NEED TOKEN PAYLOAD RETRIEVAL THEN
// ------   IT CAN BE TESTED HERE.

  it('should reject a retrieve request for a non existent user', function(done){
    request = httpMocks.createRequest({
      method: 'GET',
      url: '/api/user/123456789',
      params: {
        userId: 123456789
      }
    });

    userController.retrieve(request,response);

    response.on('end',function(){
      parsed_response = JSON.parse(response._getData());
      expect(response.statusCode).to.equal(404);
      expect(parsed_response.error).to.equal(errorMessage.userNotFound);
      done();
    });
  });

  it('should retrieve a user', function(done){
    request = httpMocks.createRequest({
      method: 'GET',
      url: '/api/user/'+user_inserted_id,
      params: {
        userId: user_inserted_id
      }
    });

    userController.retrieve(request,response);

    response.on('end',function(){
      parsed_response = JSON.parse(response._getData());
      expect(response.statusCode).to.equal(200);
      expect(parsed_response.name).to.equal(user_name);
      done();
    });
  });
  
  it('should retrieve all user', function(done){
    request = httpMocks.createRequest({
      method: 'GET',
      url: '/api/user'
    });

    userController.list(request,response);

    response.on('end',function(){
      parsed_response = JSON.parse(response._getData());
      expect(response.statusCode).to.equal(200);
      done();
    });
  });

  it('should reject a list all request if ther\'s no users at all', function(done){
   
    sequelize.sync({ force: true })
      .then( function(ok) {
        request = httpMocks.createRequest({
          method: 'GET',
          url: '/api/user'
        });

        userController.list(request,response);
    
        response.on('end',function(){
          parsed_response = JSON.parse(response._getData());
          expect(response.statusCode).to.equal(404);
          expect(parsed_response.error).to.equal(errorMessage.noUserYet);
          done();
        });

      });        
  });


});
