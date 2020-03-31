'use strict';
module.exports = (sequelize, DataTypes) => {
  const PenExternal = sequelize.define('PenExternal', {
    externalId: DataTypes.INTEGER,
    penId: DataTypes.INTEGER,
    externalType: DataTypes.INTEGER,
    url: DataTypes.STRING
  }, {});
  PenExternal.associate = function(models) {
    PenExternal.belongsTo(models.Pen);
  };
  return PenExternal;
};