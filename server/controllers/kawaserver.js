'use strict' 

const KawaServer = require(__dirname+'/../models').KawaServer ;
const errorMessage = require(__dirname+'/../assets/error_message');
const jwt = require('jsonwebtoken');
const secret = require('../authentication').optionsJWT.secretOrKey;
const jwtOptions = require('../authentication').optionsJWT;
const User = require(__dirname+'/../models').User ;

module.exports = {
  
  getInfo(request, response){
    // requesting user to differenciate pannels between admin and non admin
    let requesting_user_id, requesting_user ;
    try{
      let token = (request.get('Authorization')).trim().slice(6).trim();
      let decoded = jwt.verify(token,secret);
      requesting_user_id = decoded.id ;
    }catch( exception ){
      return setTimeout(function() {
        return response.status(500).json({ error: errorMessage.server });
      }, 100);
    }
  
    return User.findById(requesting_user_id).then( user => {
      // differenciation there
      return KawaServer.findAll() ;
    }).then(kawaServers => {
      if(kawaServers.length>1){
        return response.status(409).json({ error: errorMessage.corruptedTable});
      }else {
        let returned_serveur = kawaServers[0];
        return response.status(200).json(returned_serveur);
      }
    }).catch(error => {
      console.log(error);
      try{
        return response.status(400).json({error: errorMessage.badRequest });
      }catch(e) {}
    
    });

  },

  reset(request,response){
    let requesting_user_id, requesting_user ;
    try{
      let token = (request.get('Authorization')).trim().slice(6).trim();
      let decoded = jwt.verify(token,secret);
      requesting_user_id = decoded.id;
    }catch(exception){
      return setTimeout( function() {
        return response.status(500).json({ error: errorMessage.server });
      }, 100);
    }

    console.log(requesting_user_id);
    return User.findById(requesting_user_id).then(user => {
      // differenciate between admin and no admin there 
      if( user.admin){
        console.log('hello');
        return KawaServer.findAll();
      }else{
        return response.status(403).json({errr: errorMessage.unauthorized });
      }
    }).then(serveurs => {
      serveurs.forEach( function(elem) {
        elem.destroy();     
      });
      return response.status(204).end();
    }).catch( error => {
      console.log(error);
      try{
        return response.status(400).json({error: errorMessage.badRequest });
      }catch(e) {}
    });
  },

  setInfo( request, response ){
    // set info manually into the server
    let requesting_user_id, requesting_user ;
    let port ;

  try{
    let token = (request.get('Authorization')).trim().slice(6).trim();
    let decoded = jwt.verify(token,secret);
    requesting_user_id = decoded.id ;
  }catch(exception){
    return setTimeout( function(){
      return response.status(500).json({ error: errorMessage.server });
    },100);
  }
  
  return KawaServer.findAll().then( servers => {
    if(servers.length >0){
      return servers[0].destroy();    
    }
  }).then( ok => {
    return User.findById(requesting_user_id);
  }).then( user => {
    // gather address and identifier manually :
    if( user.admin){
      let ip = request.body.ip ;
      let id = request.body.identifier ;
      port = request.body.port ;
      if(ip && id && port){
        return KawaServer.create({ ip: ip, identifiant: id, port: port });
      }else{
        return response.status(400).json({error: errorMessage.badRequest });
      }
    }else{
      return response.status(403).json({ error: errorMessage.unauthorized });
    }
  }).then( server => {
    // modify config file && restart the server
    let fs = require('fs');
    let data = ' { "port": '+port+' }';
    let fichier = __dirname+'/../../config/config.json';
    fs.writeFileSync(fichier,data);
    return fs;
  }).then( fs => {
    // restart server so , dont return response 
    let reboot_commutator = __dirname+"/../../commutator.reboot";
    fs.writeFileSync(reboot_commutator,"rebooted");
    //return response.status(200).json(server);
  }).catch( error => {
    try{
      console.log(error);
      return response.status(400).json({ error: errorMessage.badRequest });
    }catch(e) {}
  });

  } 
}
