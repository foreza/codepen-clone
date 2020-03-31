'use strict';
module.exports = (sequelize, DataTypes) => {
  const PenFragment = sequelize.define('PenFragment', {
    fragmentId: DataTypes.INTEGER,
    penId: DataTypes.INTEGER,
    fragmentType: DataTypes.INTEGER,
    htmlClass: DataTypes.STRING,
    htmlHead: DataTypes.STRING
  }, {});
  PenFragment.associate = function(models) {
    PenExternal.belongsTo(models.Pen);
  };
  return PenFragment;
};