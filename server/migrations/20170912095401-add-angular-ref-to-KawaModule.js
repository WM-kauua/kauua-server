'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('KawaModules','ngModuleName',Sequelize.STRING);
    queryInterface.addColumn('KawaModules','viewAreaLinkRouteName',Sequelize.STRING);
    queryInterface.addColumn('KawaModules','navigationMenuLinkRouteName',Sequelize.STRING);
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('KawaModules','ngModuleName');
    queryInterface.removeColumn('KawaModules','viewAreaLinkRouteName');
    queryInterface.removeColumn('KawaModules','navigationMenuLinkRouteName');
  }
};
