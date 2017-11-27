'use strict'

const request = require('supertest');
const app = require('../../../app.js');
const chai = require('chai');
const expect = chai.expect;
const models = require('../../../server/models');
const sequelize = models.sequelize;
const errorMessage = require('../../../server/assets/error_message');
const sinon = require('sinon');

const user_name = "legitusername";
const user_updated_name = "legitupdatedname";
const user_too_short_name = "ab";
const user_not_alphNum_name = "jeyuè_12." ;
const user_script_name = "<script>alert(1)</alert>";
const user_password = "password";
const user_too_short_password = "abcd" ;
const user_wrong_password = "wrong password";

const another_user_name = "anotherlegitname";
const another_user_password = "anotherpassword";

const third_user_name = "thirdUserName" ;
const third_user_password = "thirdUserPassword" ;

const crafted_token = "je sui s un crafted token 123456789";

let user_inserted_id, user_token, another_user_inserted_id, another_user_token, parsed_response;
let third_user_inserted_id, clock;

/**
 *  The chrono layout of the database is :
 *    - create a user , 
 *    - create another user,
 *    - set the first created user admin capability
 *    - use admin user to udate the second user name to updated_user_name
 *    - use second user to change it's name itself back to another_user_name
 *    - create a third user to test the admin capa of deleting
 *    - use second user to suppress itself
 */

describe('User route integration test', function(){

  before(function(){
    clock = sinon.useFakeTimers();
    return sequelize.sync({ force: true });
  });

  after(function(){
    clock.restore();
  });

  it('should accept a creation request for a legit user', function(done){
    request(app)
      .post('/api/user')
      .send({ name: user_name, password: user_password })
      .end(function(error, response) {
        expect(response.statusCode).to.equal(201);
        parsed_response = JSON.parse(response.text);
        expect(parsed_response.name).to.equal(user_name);
        user_inserted_id = parsed_response.id;
        done();
        if(error){
          done(error);
        }
      });
  });

  it('should accept a creation request for a another legit user', function(done){
    request(app)
      .post('/api/user')
      .send({ name: another_user_name, password: another_user_password })
      .end(function(error, response) {
        expect(response.statusCode).to.equal(201);
        parsed_response = JSON.parse(response.text);
        expect(parsed_response.name).to.equal(another_user_name);
        another_user_inserted_id = parsed_response.id;
        done();
        if(error){
          done(error);
        }
      });
  });

  it('should reject an authentication request with false credential', function(done){
    request(app)
      .post('/api/login')
      .send({ name: user_name, password: user_wrong_password })
      .end(function(error, response){
        expect(response.statusCode).to.equal(403);
        parsed_response = JSON.parse(response.text);
        expect(parsed_response.error).to.equal(errorMessage.authFailed);
        done();
       if(error){
         done(error);
       }
      });
  });

  it('should authenticate an user',function(done){
    request(app)
      .post('/api/login')
      .send({ name: user_name, password: user_password })
      .end(function(error, response){
        expect(response.statusCode).to.equal(200);
        parsed_response = JSON.parse(response.text);
        expect(parsed_response).to.have.key('token');
        user_token = parsed_response.token;
        done();
       if(error){
         done(error);
       }
      });
  });

  it('should authenticate another user',function(done){
    request(app)
      .post('/api/login')
      .send({ name: another_user_name, password: another_user_password })
      .end(function(error, response){
        expect(response.statusCode).to.equal(200);
        parsed_response = JSON.parse(response.text);
        expect(parsed_response).to.have.key('token');
        another_user_token = parsed_response.token;
        done();
       if(error){
         done(error);
       }
      });
  });

  it('should refresh token on good credential', function(done){
    request(app)
      .put('/api/login')
      .set('Content-type','application/json')
      .set('Authorization', 'bearer '+user_token)
      .end(function(error, response){
        expect(response.statusCode).to.equal(200);
        parsed_response = JSON.parse(response.text);
        expect(parsed_response).to.have.key('token');
        user_token = parsed_response.token ;
        done();
      if(error){
        done(error);
      }
    });
  });

  // ----- START OF TEST FOR UPDATES CONSTRAINTS

  it('should reject an update request without token ', function(){
    request(app)
      .put('/api/user/'+user_inserted_id)
      .send({ name: user_updated_name, password: user_password })
      .end(function(error, response){
        expect(response.statusCode).to.equal(401);
        expect(response.text).to.equal("Unauthorized");
        done();
        if(error){
          done(error);
        }
      });
  });


  it('should reject an update request with a craft token ', function(){
    request(app)
      .put('/api/user/'+user_inserted_id)
      .set('Authorization', 'bearer '+crafted_token)
      .send({ name: user_updated_name, password: user_password })
      .end(function(error, response){
        expect(response.statusCode).to.equal(401);
        expect(response.text).to.equal("Unauthorized");
        done();
        if(error){
          done(error);
        }
      });
  });

  it('should not throw on an update with a null name, the name wont change though ', function(done){
    request(app)
      .put('/api/user/'+user_inserted_id)
      .set('Content-type','application/json')
      .set('Authorization', 'bearer '+user_token)
      .send({ name: null, password: user_password })
      .end(function(error, response){
        expect(response.statusCode).to.equal(200);
        parsed_response = JSON.parse(response.text);
        expect(parsed_response.name).to.equal(user_name);
        done();
        if(error){
          done(error);
        }
      });

  });

  it('should reject an update request with an empty name, and the name wont change though', function(done){
    request(app)
      .put('/api/user/'+user_inserted_id)
      .set('Content-type','application/json')
      .set('Authorization', 'bearer '+user_token)
      .send({ name: "    ", password: user_password })
      .end(function(error, response){
        expect(response.statusCode).to.equal(400);
        parsed_response = JSON.parse(response.text);
        expect(parsed_response.error).to.equal(errorMessage.badRequest);
        done();
        if(error){
          done(error);
        }
      });
  });

  it('should reject an update request with a null password ', function(done){
    request(app)
      .put('/api/user/'+user_inserted_id)
      .set('Content-type','application/json')
      .set('Authorization', 'bearer '+user_token)
      .send({ name: user_updated_name, password: null })
      .end(function(error, response){
        expect(response.statusCode).to.equal(400);
        parsed_response = JSON.parse(response.text);
        expect(parsed_response.error).to.equal(errorMessage.badRequest);
        done();
        if(error){
          done(error);
        }
      });

  });

  it('should reject an update request with an empty password', function(done){
    request(app)
      .put('/api/user/'+user_inserted_id)
      .set('Content-type','application/json')
      .set('Authorization', 'bearer '+user_token)
      .send({ name: user_updated_name, password: "     " })
      .end(function(error, response){
        expect(response.statusCode).to.equal(400);
        parsed_response = JSON.parse(response.text);
        expect(parsed_response.error).to.equal(errorMessage.badRequest);
        done();
        if(error){
          done(error);
        }
      });
  });

  it('should reject an update request for a user which name is not alphaNumeric', function(done){
    request(app)
      .put('/api/user/'+user_inserted_id)
      .set('Content-type','application/json')
      .set('Authorization', 'bearer '+user_token)
      .send({ name: user_not_alphNum_name, password: user_password })
      .end(function(error, response){
        expect(response.statusCode).to.equal(400);
        parsed_response = JSON.parse(response.text);
        expect(parsed_response.error).to.equal(errorMessage.badRequest);
        done();
        if(error){
          done(error);
        }
      });
  });

  it('should reject an update request for a user which name is too short', function(done){
    request(app)
      .put('/api/user/'+user_inserted_id)
      .set('Content-type','application/json')
      .set('Authorization', 'bearer '+user_token)
      .send({ name: user_too_short_name, password: user_password })
      .end(function(error, response){
        expect(response.statusCode).to.equal(400);
        parsed_response = JSON.parse(response.text);
        expect(parsed_response.error).to.equal(errorMessage.badRequest);
        done();
        if(error){
          done(error);
        }
      });
  });
 
  it('should reject an update request for a user which password is too short', function(done){
    request(app)
      .put('/api/user/'+user_inserted_id)
      .set('Content-type','application/json')
      .set('Authorization', 'bearer '+user_token)
      .send({ name: user_updated_name, password: user_too_short_password })
      .end(function(error, response){
        expect(response.statusCode).to.equal(400);
        parsed_response = JSON.parse(response.text);
        expect(parsed_response.error).to.equal(errorMessage.badRequest);
        done();
        if(error){
          done(error);
        }
      });
  });

  it('should reject an update request for a user which does not exists', function(done){
    request(app)
      .put('/api/user/123456789')
      .set('Content-type','application/json')
      .set('Authorization', 'bearer '+user_token)
      .send({ name: user_updated_name, password: user_password })
      .end(function(error, response){
        expect(response.statusCode).to.equal(404);
        parsed_response = JSON.parse(response.text);
        expect(parsed_response.error).to.equal(errorMessage.userNotFound);
        done();
        if(error){
          done(error);
        }
      });
  });

  it('should reject an update request for another user if the caller is not an admin', function(done){
    request(app)
      .put('/api/user/'+another_user_inserted_id)
      .set('Authorization', 'bearer '+user_token)
      .send({ name: user_updated_name, password: user_password })
      .end(function(error, response){
        expect(response.statusCode).to.equal(403);
        parsed_response = JSON.parse(response.text);
        expect(parsed_response.error).to.equal(errorMessage.unauthorized);
        done();
        if(error){
          done(error);
        }
      }); 
  });

  it('should accept an update request for another user if the caller is a admin', function(done){
    
    // first set admin on the first created user :
    request(app)
      .post('/api/user/admin')
      .set('Authorization', 'bearer '+user_token)
      .end(function(error,response){
        request(app)
        .put('/api/user/'+another_user_inserted_id)
        .set('Authorization', 'bearer '+user_token)
        .send({ name: user_updated_name, password: user_password })
        .end(function(error, response){
          expect(response.statusCode).to.equal(200);
          parsed_response = JSON.parse(response.text);          
          expect(parsed_response.name).to.equal(user_updated_name);
          done();
          if(error){
            done(error);
          }
        });
      });
  });

  it('should update on a legit request', function(done){
    request(app)
      .put('/api/user/'+another_user_inserted_id)
      .set('Authorization', 'bearer '+another_user_token)
      .send({ name: another_user_name, password: another_user_password })
      .end(function(error, response){
        expect(response.statusCode).to.equal(200);
        parsed_response = JSON.parse(response.text);
        expect(parsed_response.name).to.equal(another_user_name);
        done();
        if(error){
          done(error);
        }
      });
  });

  

  it('should sanitize an script injection on the name then reject a create request', function(done){
    request(app)
      .post('/api/user')
      .send({ name: user_script_name, password: user_password })
      .end(function(error, response){
        expect(response.statusCode).to.equal(400);
        expect(JSON.parse(response.text).error).to.equal(errorMessage.badRequest);
        done();
        if(error){
          done(error);
        }
      });
  });

  it('should sanitize a script injection on the name then reject a update request', function(done){
    request(app)
      .put('/api/user/'+user_inserted_id)
      .set('Authorization', 'bearer '+user_token)
      .send({ name: user_script_name, password: user_password })
      .end( function(error, response){
        expect(response.statusCode).to.equal(400);
        expect(JSON.parse(response.text).error).to.equal(errorMessage.badRequest);
        done();
        if(error){
          done(error);
        }
      });
  });


  it('should reject an update request here the userId param is not a number', function(done){
    request(app)
      .put('/api/user/NaN')
      .send({ name: user_updated_name, password: user_password })
      .set('Authorization', 'bearer '+user_token)
      .end(function(error, response){
        expect(response.statusCode).to.equal(400);
        expect(JSON.parse(response.text).error).to.equal(errorMessage.badRequest);
        done();
       if(error){
         done(error);
       }
      });
  });

// -----  DELETE REQUEST :

  it('should reject a delete request which lack authorization token', function(done){
    request(app)
      .delete('/api/user/'+user_inserted_id)
      .end(function(error,response){
        expect(response.statusCode).to.equal(401);
        parsed_response = response.text;
        expect(parsed_response).to.equal("Unauthorized");
        done();
        if(error){
          done(error);
        }
      });
  });

  it('should reject an delete request with a forged authorization token', function(done){
    request(app)
      .delete('/api/user/'+user_inserted_id)
      .set('Authorization', 'bearer '+crafted_token)
      .end(function(error,response){
        expect(response.statusCode).to.equal(401);
        parsed_response = response.text;
        expect(parsed_response).to.equal("Unauthorized");
        done();
        if(error){
          done(error);
        }
      });
  });

  it('should reject a delete request for a user which do not exists', function(done){
    request(app)
      .delete('/api/user/123456789')
      .set('Authorization','bearer '+user_token)
      .end(function(error,response){
        expect(response.statusCode).to.equal(404);
        parsed_response = JSON.parse(response.text);
        expect(parsed_response.error).to.equal(errorMessage.userNotFound);
        done();
        if(error){
          done(error);
        }
      });
  });

  it('should reject a delete request from a user which is not admin to another user', function(done){
    
    request(app)
      .delete('/api/user/'+user_inserted_id)
      .set('Authorization','bearer '+another_user_token)
      .end(function(error,response){
        expect(response.statusCode).to.equal(403);
        parsed_response = JSON.parse(response.text);
        expect(parsed_response.error).to.equal(errorMessage.unauthorized);
        done();
        if(error){
          done(error);
        }
      });
  });
 
  it('should reject a delete request where the userId is not a number', function(done){
    request(app)
      .delete('/api/user/NaN')
      .set('Authorization','bearer '+user_token)
      .end(function(error,response){
        expect(response.statusCode).to.equal(400);
        expect(JSON.parse(response.text).error).to.equal(errorMessage.badRequest);
        done();
        if(error){
          done(error);
        }
      });
  });

  it('should delete an user if the caller is an admin', function(done){
    request(app)
      .post('/api/user')
      .send({ name: third_user_name, password: third_user_password })
      .end(function(error, response) {
        expect(response.statusCode).to.equal(201);
        parsed_response = JSON.parse(response.text);
        expect(parsed_response.name).to.equal(third_user_name);
        third_user_inserted_id = parsed_response.id;
       request(app)
         .delete('/api/user/'+third_user_inserted_id)
         .set('Authorization', 'bearer '+user_token)
         .end(function(error,response){
           expect(response.statusCode).to.equal(204);
           done();
           if(error){
             done(error);
           }
       });
    });
  });

  it('should accept an user to delete himself', function(done){
    request(app)
      .delete('/api/user/'+another_user_inserted_id)
      .set('Authorization','bearer '+another_user_token)
      .end(function(error,response){
        expect(response.statusCode).to.equal(204);
        done();
        if(error){
          done(error);
        }
      });
  });

  it('should reject a request whence token is expired', function(done){
    clock.tick(31*60*1000);
    request(app)
      .put('/api/login')
      .set('Content-type','application/json')
      .set('Authorization', 'bearer '+user_token)
      .end(function(error, response){
        expect(response.statusCode).to.equal(401);
        expect(response.text).to.equal("Unauthorized");
        done();
      if(error){
        done(error);
      }
    });
  });

  it('should loggOff a user', function(done){
    request(app)
      .post('/api/login')
      .set('Content-type','application/json')
      .send({ name: user_name, password: user_password })
      .end(function(error,response){
        //retrieve new token :
        parsed_response = JSON.parse(response.text);
        user_token = parsed_response.token;
        request(app)
        .delete('/api/login')
        .set('Content-type','application/json')
        .set('Authorization','bearer '+user_token)
        .end(function(error,response){
          expect(response.statusCode).to.equal(204);
          done();
          if(error){
            done(error);
          }
        });
      });
  });
/*
  it('should accept a delete request', function(done){
    request(app)
      .delete('/api/user/'+user_inserted_id)
      .set('Authorization','bearer '+user_token)
      .end(function(error,response){
        expect(response.statusCode).to.equal(204);
        done();
        if(error){
          done(error);
        }
      });
  });
*/
});
