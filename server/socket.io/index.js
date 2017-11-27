'use strict'
const kawaServer = require('../models').KawaServer ;


const variable_transmise = "je suis transmise";

module.exports = (io) => {
  io.of('/systemapi').on('connect', function(socket){
    console.log("nouveau client connecté");
    socket.on('identifier', function( identifiant, ip, port, fn ){
      console.log(identifiant) ;
      kawaServer.create({identifiant:identifiant,ip:ip, port: port}).then( instance => {
        fn(variable_transmise, null);
      }).catch( error => {
        console.log(error);
        fn(variable_transmise, error);
      });
    });
    socket.on('disconnect', function() {
      console.log('client déconnecté');
    });
  });
  io.on('message', function(){
    console.log("message recu");
  });

  io.of('/jesuisunNM').on('connect', function(socket){
    console.log('nouveau client connecté');
    socket.on('disconnect', function(){
      console.log('déconneciton') ;
    });
  });
}
