'use strict';
module.exports = (sequelize, DataTypes) => {
  const Pen = sequelize.define('Pen', {
    penId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    penName: DataTypes.STRING,
    cssContent: DataTypes.TEXT,
    jsContent: DataTypes.TEXT,
    htmlContent: DataTypes.TEXT,
    cssExternal: DataTypes.ARRAY(DataTypes.TEXT),
    htmlExternal: DataTypes.ARRAY(DataTypes.TEXT),
    jsExternal: DataTypes.ARRAY(DataTypes.TEXT)
  }, {});
  Pen.associate = function(models) {
    // associations can be defined here
    Pen.belongsTo(models.User);

  };
  return Pen;
};