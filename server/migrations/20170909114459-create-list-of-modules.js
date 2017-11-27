'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('ListOfModules', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
	references: {
	  model: 'Users',
	  key: 'id'
        },
        unique: 'compositeIndex',
        onDelete: 'CASCADE'
      },
      moduleId: {
        type: Sequelize.INTEGER,
	references: {
	  model: 'KawaModules',
	  key: 'id'
	},
        unique: 'compositeIndex',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('ListOfModules');
  }
};
