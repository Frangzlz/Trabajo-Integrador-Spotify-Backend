// Modelo Genero

const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Genero = sequelize.define('genero', {
  id_genero: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false
  }
}, {
  tableName: 'genero',
  timestamps: false
})

module.exports = { Genero }