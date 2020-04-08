'use strict';
module.exports = (sequelize, DataTypes) => {
  const PenFragment = sequelize.define('PenFragment', {
    fragmentId: DataTypes.INTEGER,
    penId: DataTypes.INTEGER,
    fragmentType: DataTypes.INTEGER,
    body: DataTypes.STRING
  }, {});
  PenFragment.associate = function(models) {
    PenFragment.belongsTo(models.Pen);
  };
  return PenFragment;
};