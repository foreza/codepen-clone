'use strict';
module.exports = (sequelize, DataTypes) => {
  const Pen = sequelize.define('Pen', {
    penId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    penName: DataTypes.STRING,
    htmlClass: DataTypes.STRING,
    htmlHead: DataTypes.STRING,
    numFavorites: DataTypes.INTEGER,
    numComments: DataTypes.INTEGER,
    numViews: DataTypes.INTEGER,
  }, {});
  Pen.associate = function (models) {
    Pen.belongsTo(models.User);
  };
  return Pen;
};


