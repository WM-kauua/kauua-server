'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(module.filename);
var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../config/config.json')[env];
var db        = {};

if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(function(file) {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Keep the base as it
// to hugely modify :
// foreach kawamodules,
//  - if that kawaModule contains a models directory : 
//    for each file: import the model with sequelize['import']
//    add it to db
//    and makes its associations

// Require pre order by figure

const kawaModulesDir = __dirname+'/../modules';
let model ;
let associations = [];

fs.readdirSync(kawaModulesDir)
  .filter(function(file){
    return fs.statSync(kawaModulesDir+'/'+file).isDirectory();
  })
  .forEach(function(file){
    // for each kawaModule 
    let kModuleDir = kawaModulesDir+'/'+file;
    let thisKModuleModelDir = kModuleDir+'/models' ;
    
    fs.readdirSync(thisKModuleModelDir)
    .filter(function(modelFile){
      return (fs.statSync(thisKModuleModelDir+'/'+modelFile).isFile() && modelFile.slice(-3) === '.js');
    })
    .forEach(function(modelFile){
      model = sequelize['import'](path.join(thisKModuleModelDir,modelFile));
      db[model.name] = model;
      if(db[model.name].associate){
        associations.push(model.name);
      }
    });
  });

associations.forEach(function(modelName){
  console.log(modelName);
  db[modelName].associate(db);
});

// update associations :

fs.readdirSync(kawaModulesDir)
  .filter(function(file){
    return fs.statSync(kawaModulesDir+'/'+file).isDirectory();
  })
  .forEach(function(file){
    // for each kawaModule
    let kModuleDir = kawaModulesDir+'/'+file;
    let thisKModuleModelDir = kModuleDir+'/models' ;

    fs.readdirSync(thisKModuleModelDir)
    .filter(function(modelFile){
      return ( modelFile === 'update' );
    })
    .forEach(function(modelFile){
      console.log('updated');
      require(path.join(thisKModuleModelDir,modelFile))(db);
    });
  });



module.exports = db;
