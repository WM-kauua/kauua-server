'use strict'

const User = require(__dirname+'/../models').User;
const errorMessage = require(__dirname+'/../assets/error_message');
const jwt = require('jsonwebtoken');
const secret = require('../authentication').optionsJWT.secretOrKey;
const jwtOptions = require('../authentication').optionsJWT;

/**
 * @Module User Controller 
 */

module.exports = {

  /**
   *  @function create - control access request for the creation of an user
   */
  create(request, response){
    return User.create({
      name: request.body.name,
      password: request.body.password 
    })
    .then( user => { 
      return response.status(201).json({ name: user.name, id: user.id });
    })
    .catch( error => {
      // check if error is unicity constraint violation
      if(error.name === 'SequelizeUniqueConstraintError'){
        return response.status(400).json({ error: errorMessage.nameAlreadyPresent }); 
      }else{
	return response.status(400).json({ error: errorMessage.badRequest });
      }
    });
  },

  /**
   * @function update - control acces request for the update of an user
   *  Only admin & self update are authorized
   */
  update(request, response){
//    console.log('inside update');
    let updating_user_id;
    let updating_user, updated_user;
    try{ 
      let token = (request.get('Authorization')).trim().slice(6).trim();
      let decoded = jwt.verify(token, secret);
      updating_user_id = decoded.id;
    }catch( exception ){
      return setTimeout(function(){
        return response.status(500).json({ error: errorMessage.server });
      }, 100);
    }

    return User.findById(updating_user_id)
      .then( user => {
        if( user ){
          updating_user = user;
          return User.findById(request.params.userId);
        }else{
          // token corrupted :
          return response.status(500).json({ error: errorMessage.server });
        }
      })
      .then( user => {
        if(user) {
          updated_user = user;
          if( updating_user.isAdmin() ){
            return user.update({
              name: request.body.name || user.name ,
              password: request.body.password ,
              admin: request.body.admin || user.admin
            }) ;
          }
          else if( updated_user.id === updating_user.id){
            return user.update({
              name: request.body.name || user.name ,
              password: request.body.password ,
            }) ;
          } else {
            // not authorized :
            return response.status(403).json({ error: errorMessage.unauthorized });
          }
        }else{
          // no user to update
          return response.status(404).json({ error: errorMessage.userNotFound });
        }
      })
      .then( user => {
        return response.status(200).json({ name: user.name });
      })
      .catch( error => {
        // console.log(error);
        try{
          return response.status(400).json({ error: errorMessage.badRequest });
        }catch( e ){
          // adress reset response header exception issue on the late promise 
        }
      });
  },

  /**
   * @function list - retrieve all users in the database
   */
  list(request,response){
    return User.findAll({
      attributes: ['name']
      })
      .then( users => {
        if(users.length>0){
          return response.status(200).json(users);
        }
        else{
          return response.status(404).json({ error: errorMessage.noUserYet });
        }
      })
      .catch( error => {
        return response.status(500).json({ error : errorMessage.server });
      });
  },

  /**
   * @function retrieve - retrieve 1 user
   */
  retrieve(request,response){
    return User.findById(request.params.userId)
      .then( user => {
        if(user){
          return response.status(200).json(user);
        }
        else{
          return response.status(404).json({ error: errorMessage.userNotFound });
        }
      })
      .catch( error => {
        cnosole.log(error);
        return response.status(500).json({ error: errorMessage.server });
      });
  },
  
  /**
   * @function delete - delete an user
   *  Self user can delete themselves, admin can delete anyone
   */
  delete(request,response){
    let deleting_user_id;
    try{
      let token = request.get('Authorization').trim().slice(6).trim() ;
      let decoded = jwt.verify(token,secret);
      deleting_user_id = decoded.id;
    }catch( exception ){
      return setTimeout(function(){
        return response.status(500).json({ error: errorMessage.server });
      },100);
    }
    let deleting_user, deleted_user ;

    return User.findById(deleting_user_id)
      .then( user => {
        if(user){
          deleting_user = user;
          return User.findById(request.params.userId);
        } else{
          return response.status(404).json({ error: errorMessage.userNotFound });
        }
      })
      .then( user => {
        if(user){
          deleted_user = user ;
          if( deleting_user.isAdmin() ){
            return deleted_user.destroy();
          } else if( deleted_user.id === deleting_user.id ) {
            return deleted_user.destroy();
          } else{
            return response.status(403).json({ error: errorMessage.unauthorized });
          }
        } else {
          return response.status(404).json({ error: errorMessage.userNotFound });
        }
      })
      .then( ok => {
        return response.status(204).end();
      })
      .catch(error => {
        try{
          // address reset header issue
          return response.status(400).json({ error: errorMessage.badRequest });
        }catch(e) {}
      });
  },

  /**
   * @function authenticate - authenticate an user and send back a token
   */  
  authenticate(request,response){
    let identifiedUser;
    return User.findOne({ where: { name: request.body.name }})
      .then( user => {
        if(user){
          identifiedUser = user;
          return user.authenticate(request.body.password);
        }
        else{
          return response.status(404).json({ error: errorMessage.userNotFound });
        }
      })
      .then( isAuthenticated => {
        if( isAuthenticated){
          let payload = { id: identifiedUser.id };
          let token = jwt.sign(payload, jwtOptions.secretOrKey, { expiresIn: '30m' } );
          return response.status(200).json({ token: token });
        }
        else{
          console.log('user not authenticated');
          return response.status(403).json({ error: errorMessage.authFailed });
        }
      })
      .catch( error => {
        // handle reset headers exception
        try{
          return response.status(500).json({ error: errorMessage.server });
        }catch( exception ) {}
      });
  },

  /**
   * @function refreshToken - create a new token with an old which is not expired yet
   */

  refreshToken(request,response){
    let refreshingUserId, refreshingUser ;
    try{
      let token = request.get('Authorization').trim().slice(6).trim() ;
      let decoded = jwt.verify(token,secret);
      refreshingUserId = decoded.id;
    }catch( exception ){
      return setTimeout(function(){
        return response.status(500).json({ error: errorMessage.server });
      },100);
    }

    return User.findById(refreshingUserId)
      .then( user => {
        if(user){
          refreshingUser = user;
          let payload = { id: refreshingUser.id };
          let token = jwt.sign(payload, jwtOptions.secretOrKey, { expiresIn: '30m' });
          return response.status(200).json({ token: token });
        }
        else{
          return response.status(404).json({ error: errorMessage.userNotFound });
        }
      })
      .catch( error => {
        return response.status(500).json({ error: errorMessage.server });
      });
  },

  /**
   * @ function logOff - function to log off authenticated user
   */

  logOff(request,response){
    let logginOffUserId ;
     try{
      let token = request.get('Authorization').trim().slice(6).trim() ;
      let decoded = jwt.verify(token,secret);
      logginOffUserId = decoded.id;
    }catch( exception ){
      return setTimeout(function(){
        return response.status(500).json({ error: errorMessage.server });
      },100);
    }

    // reset token :
    return User.findById(logginOffUserId)
      .then(user => {
        if(user){
          let payload = { id: user.id };
          let token = jwt.sign(payload, jwtOptions.secretOrKey, { expiresIn: '30m' } );
          return response.status(204).end();
        }
        else{
          return response.status(404).json({ error: errorMessage.userNotFound });
        }
      }).catch( error => {
        return response.status(500).json({ error: errorMessage.server });
      });

  },

  /**
   * @function setAdmin - function using for testing purpose, 
   *  - should be commented out once tests are finished to improve paranoid
   *    security.
   */

  // specific handle for testing purpose 
  setAdmin(request,response){
    let admin_user_id ;
    try{
      let token = request.get('Authorization').trim().slice(6).trim() ;
      let decoded = jwt.verify(token,secret);
      admin_user_id = decoded.id;
    }catch( exception ){
      return setTimeout(function(){
        return response.status(500).json({ error: errorMessage.server });
      },100);
    }

    return User.findById( admin_user_id )
      .then( user => {
        let userAdmin = user ;
        return userAdmin.setAdmin(true);
      })
      .then( ok => {
        return response.status(200).end();
      })
      .catch( error => {
        return response.status(400).end();
      });
  },
  /**
   *  getPrivileges() : get user administrative privilege level
   */
  getPrivileges(request,response){
    let requesting_user_id, requesting_user ;
    try{
      let token = request.get("Authorization").trim().slice(6).trim();
      let decoded = jwt.verify(token,secret);
      requesting_user_id = decoded.id ;
    }catch(exception){
      return setTimeout( function(){
        return response.status(500).json({ error: errorMessage.server });
      },100);
    }

    console.log("User id: "+requesting_user_id);
    return User.findById(requesting_user_id).then( user => {
      if(user){
        requesting_user = user ;
        return response.status(200).json(user.admin);
      }else{
        return response.status(404).json({ error: errorMessage.userNotFound });
      }
    }).catch( error => {
      console.log(error);
      try{
        return response.status(400).json({error: errorMessage.badRequest});
      }catch(e){}
    });
  },
}

