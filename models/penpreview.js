'use strict';
module.exports = (sequelize, DataTypes) => {
  const PenPreview = sequelize.define('PenPreview', {
    previewId: DataTypes.STRING,
    penId: DataTypes.STRING,
    uri: DataTypes.STRING
  }, {});
  PenPreview.associate = function(models) {
    PenPreview.belongsTo(models.Pen);
  };
  return PenPreview;
};