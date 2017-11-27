'use strict';
module.exports = function(sequelize, DataTypes) {
  var ListOfModules = sequelize.define('ListOfModules', {
   
    userId: {
      type: DataTypes.INTEGER,
      unique: 'compositeIndex'
    },
    moduleId: { 
      type: DataTypes.INTEGER,
      unique: 'compositeIndex'
    }
  
  });

  return ListOfModules;
};
