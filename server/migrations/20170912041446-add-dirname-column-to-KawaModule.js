'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('KawaModules','dirname',
      { type: Sequelize.STRING });
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn( 'KawaModules', 'dirname' );
  }
};
