'use strict';
module.exports = function(sequelize, DataTypes) {
  var KawaModule = sequelize.define('KawaModule', {
    name: DataTypes.STRING,
    dirname : DataTypes.STRING,
    ngModuleName: DataTypes.STRING,
    viewAreaLinkRouteName: DataTypes.STRING,
    navigationMenuLinkRouteName: DataTypes.STRING,
    sideRouteName: DataTypes.STRING
  });

   KawaModule.associate = (models) => {

    KawaModule.belongsToMany(models.User, {
      through: {
        model: models.ListOfModules,
      },
      foreignKey: 'moduleId',
    });
  }

 /* KawaModule.associate = (models) => {
    KawaModule.belongsToMany(models.User, { through: 'UserKawaModule' });
  };*/

  return KawaModule;
};
