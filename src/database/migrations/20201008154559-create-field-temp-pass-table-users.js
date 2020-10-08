'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'temp_pass_hash', {type: Sequelize.STRING});
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('users', 'temp_pass_hash', {});
  }
};
