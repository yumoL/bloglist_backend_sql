const { DataTypes } = require('sequelize')

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.addColumn('users', 'enabled', {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    })
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('users', 'enabled')
  },
}