'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Customer.init({
    full_name: DataTypes.STRING,
    omitted_name: DataTypes.STRING,
    printed_name_1st: DataTypes.STRING,
    printed_name_2nd: DataTypes.STRING,
    zip_code_1st: DataTypes.STRING,
    zip_code_2nd: DataTypes.STRING,
    addr_name_1st: DataTypes.STRING,
    addr_num1_1st: DataTypes.INTEGER,
    addr_num2_1st: DataTypes.INTEGER,
    addr_num3_1st: DataTypes.INTEGER,
    addr_num4_1st: DataTypes.INTEGER,
    building_name_1st: DataTypes.STRING,
    building_num_1st: DataTypes.STRING,
    building_unit_1st: DataTypes.STRING,
    addr_name_2nd: DataTypes.STRING,
    addr_num1_2nd: DataTypes.INTEGER,
    addr_num2_2nd: DataTypes.INTEGER,
    addr_num3_2nd: DataTypes.INTEGER,
    addr_num4_2nd: DataTypes.INTEGER,
    building_name_2nd: DataTypes.STRING,
    building_num_2nd: DataTypes.STRING,
    building_unit_2nd: DataTypes.STRING,
    state: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Customer',
  });
  return Customer;
};