'use strict';
module.exports = function(sequelize, DataTypes) {
  var KawaServer = sequelize.define('KawaServer', {
    identifiant: DataTypes.STRING,
    ip: DataTypes.STRING,
    port: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return KawaServer;
};
