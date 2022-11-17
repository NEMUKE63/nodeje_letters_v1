'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Customers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      full_name: {
        type: Sequelize.STRING
      },
      omitted_name: {
        type: Sequelize.STRING
      },
      printed_name_1st: {
        type: Sequelize.STRING
      },
      printed_name_2nd: {
        type: Sequelize.STRING
      },
      zip_code_1st: {
        type: Sequelize.STRING
      },
      zip_code_2nd: {
        type: Sequelize.STRING
      },
      addr_name_1st: {
        type: Sequelize.STRING
      },
      addr_num1_1st: {
        type: Sequelize.INTEGER
      },
      addr_num2_1st: {
        type: Sequelize.INTEGER
      },
      addr_num3_1st: {
        type: Sequelize.INTEGER
      },
      addr_num4_1st: {
        type: Sequelize.INTEGER
      },
      building_name_1st: {
        type: Sequelize.STRING
      },
      building_num_1st: {
        type: Sequelize.STRING
      },
      building_unit_1st: {
        type: Sequelize.STRING
      },
      addr_name_2nd: {
        type: Sequelize.STRING
      },
      addr_num1_2nd: {
        type: Sequelize.INTEGER
      },
      addr_num2_2nd: {
        type: Sequelize.INTEGER
      },
      addr_num3_2nd: {
        type: Sequelize.INTEGER
      },
      addr_num4_2nd: {
        type: Sequelize.INTEGER
      },
      building_name_2nd: {
        type: Sequelize.STRING
      },
      building_num_2nd: {
        type: Sequelize.STRING
      },
      building_unit_2nd: {
        type: Sequelize.STRING
      },
      state: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Customers');
  }
};