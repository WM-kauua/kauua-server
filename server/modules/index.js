'use strict';

const fs 	= require('fs');
const path	= require('path');
const basename	= path.basename(module.filename);
let routeArray	= [];

// lit toutes les routes des modules 

fs.readdirSync(__dirname)
  .filter(function(elem){
  // enlève de la liste ce fichier index.js
    return (elem !== basename);
  })
  .forEach(function(kModuleDir){
    routeArray.push(__dirname+'/./'+kModuleDir+'/routes');
  });

module.exports = (app) => {
  routeArray.forEach( (route) => {
    console.log(route);
    require( route )(app);
  });
}
