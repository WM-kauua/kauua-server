'use strict';

const KawaModule = require(__dirname+'/../models').KawaModule;
const User = require(__dirname+'/../models').User;
const jwt = require('jsonwebtoken');
const secret = require('../authentication').optionsJWT.secretOrKey;
const jwtOptions = require('../authentication').optionsJWT;
const errorMessage = require(__dirname+'/../assets/error_message');
const installer = require(__dirname+'/../scripts').installModule;

const Sequelize = require(__dirname+'/../models').Sequelize;
const sequelize = require(__dirname+'/../models').sequelize;

const fs = require('fs');
const util = require('util');
const fileRead = util.promisify(fs.readFile);
const fileClose = util.promisify(fs.close);

/**
 * @Module KawaModule Controller
 */

module.exports = {

  /**
   * @function test_install - Install the test module
   */
  test_install(request,response){
    let installing_user, installing_user_id ;
    try{
      let token = (request.get('Authorization')).trim().slice(6).trim();
      let decoded = jwt.verify(token, secret);
      installing_user_id = decoded.id;
    }catch( exception){
      return setTimeout(function(){
        return response.status(500).json({ error: errorMessage.server });
      }, 100);
    }
    
    return User.findById(installing_user_id)
      .then( user => {
        installing_user = user ;
        if( installing_user){
          return KawaModule.create(
            { name: "premierModule",
              dirname: './kawaModules/premierModule',
              ngModuleName: "PremierModule",
              viewAreaLinkRouteName: "premierModuleViewAreaRoute",
              navigationMenuLinkRouteName: "premierModuleNaviRoute"
            }
          );
        }else{
          return response.status(404).json({ error: errorMessage.userNotFound });
        }
      }).then( kawamodule => {
        kawamodule.addUser(installing_user);
        return 'ok'; 
      }).then( ok => {
        return installer.install();
      }).then( () => {
        return response.status(204).end('ok');
      }).catch( err => {
        return response.status(500).json({ error: errorMessage.server });
      });
  },
  
  /**
   *  @function getModules - send back all the modules associated with the authenticated user
   */
  getModules(request,response){
    let asking_user, asking_user_id ;
    try{
      let token = (request.get('Authorization')).trim().slice(6).trim();
      let decoded = jwt.verify(token, secret);
      asking_user_id = decoded.id;
    }catch( exception){
      return setTimeout(function(){
        return response.status(500).json({ error: errorMessage.server });
      }, 100);
    }

    return User.findById(asking_user_id).then( user => {
      if(user){
        return user.getKawaModules();
      } else {
        return response.status(404).json({ error: errorMessage.userNotFound });
      }
    }).then( modules => {
      return response.status(200).json(modules);
    }).catch( error => {
      return response.status(500).json({ error: errorMessage.server });
    });

  },

  /**
   * @function insertModule - crée l'entrée dans la base de donnée pour le module spécifié
   */ 
  insertModule(request,response){
    let installingUserId, installingUser ;
    try{
      let token = (request.get('Authorization')).trim().slice(6).trim();
      let decoded = jwt.verify(token, secret);
      installingUserId = decoded.id ;
    }catch( exception ){
      console.log('there');
      return setTimeout(function(){
        return response.status(500).json({ error: errorMessage.server });
      }, 100);
    }

    let kawamoduleName = request.params.kawaModuleName ;
    let parsedFile ;
    const kawaModuleDirName = __dirname+'/../modules/'+kawamoduleName;
    const kmoduleDir = __dirname+'/../modules';
    const manifestFile = kmoduleDir+'/'+kawamoduleName+'/manifest.json';

    return fileRead(manifestFile).then( contentFile => {
      console.log(contentFile);
      parsedFile = JSON.parse(contentFile);
      
      // index over name column handle unicity constraint
      return KawaModule.create({ name: parsedFile.kawaModuleName ,
        dirname: parsedFile.kawaModuleAngularDirectory,
        ngModuleName: parsedFile.ngModuleName,
        viewAreaLinkRouteName: parsedFile.mainSurfaceDisplayOutletRouteName,
        navigationMenuLinkRouteName: parsedFile.navigationSurfaceDisplayOutletRouteName,
        sideRouteName: parsedFile.sideSurfaceDisplayOutletRouteName });
    }).then( ok => {
      // once installed, migrate the database :
      require(kawaModuleDirName+'/install')(sequelize.getQueryInterface,Sequelize);

      return response.status(201).end();
    }).catch( error => {
      console.log(error);
      try{
        return response.status(400).json({ error: errorMessage.badRequest });
      }catch(e) { }
    });
  },

  /**
   * @function associateModule - associe le module spécifié avec l'utilisateur requérant
   */
  associateModule(request,response){
    let associatingUserId, associatingUser ;
    try{
      let token = (request.get('Authorization')).trim().slice(6).trim();
      let decoded = jwt.verify(token, secret);
      associatingUserId = decoded.id ;
    }catch( exception ){
      return setTimeout(function(){
        return response.status(500).json({ error: errorMessage.server });
      }, 100);
    }
    
    let kawamoduleName = request.params.kawaModuleName ;
    const kawaModuleDirName = __dirname+'/../modules/'+kawamoduleName;

    return User.findById(associatingUserId).then( user => {
      if(user){
        associatingUser = user;
        return KawaModule.findOne({ where: { name: kawamoduleName }});
      }else{
        return response.status(404).json({ error: errorMessage.userNotFound });
      }
    }).then( kmodule => {
      if(kmodule){
        console.log('kmodule id: '+kmodule.id);
        return associatingUser.addKawaModule(kmodule.id);
      }else {
        return response.status(404).json({ error: errorMessage.kawaModuleNotFound });
      }
    }).then( ok => {
      return require(kawaModuleDirName+'/scripts')(associatingUser);
      console.log('check user associated');
    }).then (ok => {
      return response.status(201).end();
    }).catch( error => {
      console.log(error);
      try{
        return response.status(400).json({ error: errorMessage.badRequest });
      }catch(e) { }
    });
  },
  
  /**
   * @function unAssociateModule - romps l'association entre l'utilisateur requerant et le module assigné en parametre
   */
  unAssociateModule(request,response){
    let unAssociatingUserId, unAssociatingUser, unAssociatedKawaModule ;
    try{
      let token = (request.get('Authorization')).trim().slice(6).trim();
      let decoded = jwt.verify(token, secret);
      unAssociatingUserId = decoded.id ;
    }catch( exception ){
      return setTimeout(function(){
        return response.status(500).json({ error: errorMessage.server });
      }, 100);
    }

  let kawaModuleName = request.params.kawaModuleName ;
  let kawaModuleDirName = __dirname+'/../modules/'+kawaModuleName;

  console.log(' KAWA MODULE NAME : '+kawaModuleName );

    User.findById(unAssociatingUserId).then( user => {
      if(user){
        console.log('user found');
        unAssociatingUser = user;
        return KawaModule.findOne({ where: {name: kawaModuleName }});
      }
      else {
        return response.status(404).json({ error: errorMessage.userNotFound });
      }
    }).then( kModule => {  
      if(kModule){
        console.log('module found');
        unAssociatedKawaModule = kModule ;
        return unAssociatingUser.removeKawaModule(kModule);
      }
      else {
        return response.status(404).json({error: errorMessage.kawaModuleNotFound });
      }
    }).then( ok => {
      // all shouldbe fine by there, check if the module is still associated , on to it : remove from the database
      return unAssociatedKawaModule.countUsers();
    }).then( counted => {
      console.log('count : '+counted);
      if(counted == 0){
        //uninstall module 
        require(kawaModuleDirName+'/uninstall')(sequelize.getQueryInterface,Sequelize);
        // remove the kawaModule from the list of modules :
        KawaModule.destroy({ where: { id: unAssociatedKawaModule.id }});
      }else{
        // no side effect, send ok :
      }
      return response.json(204).end();

    }).catch(error => {
      console.log(error);
      try{ 
        return response.status(500).json({ error: errorMessage.server });
      }catch(e) {} 
    });

  }

}

