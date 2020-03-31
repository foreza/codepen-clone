'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('PenExternals', {
      externalId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      penId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Pens', 
          key: 'penId', 
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',      
      },
      externalType: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false,
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('PenExternals');
  }
};