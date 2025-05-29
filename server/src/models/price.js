'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Price extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Price.init({
    cryptoId: DataTypes.INTEGER,
    date: DataTypes.DATE,
    price_usd: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'Price',
  });
  return Price;
};