'use strict';

const { Sequelize } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('enderecos', {
      Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      Cep: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      Logradouro: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      Numero: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      Complemento: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      Bairro: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      Cidade: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      Estado: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      MunicipioIBGE: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('enderecos');
  }
};