'use strict'

const fs = require('fs');
const path = require('path');
const basename = path.basename(module.filename);

const test_controllers = {} ;
console.log(__dirname);
fs.readdirSync(__dirname)
  .filter(function(file){
    return (file.indexOf('.') !== 0) && (file !== basename ) && (file.slice(-3) === '.js') ;
  })
  .forEach(function(file){
    test_controllers[file.slice(0,-3)] = path.join(__dirname,file);
  });

module.exports = test_controllers ;

