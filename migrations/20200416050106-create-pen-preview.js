'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('PenPreviews', {
      previewId: {
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
      uri: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('PenPreviews');
  }
};