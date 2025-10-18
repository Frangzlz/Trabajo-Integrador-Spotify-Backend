// Modelo CancionGenero

const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const CancionGenero = sequelize.define('CancionGenero', {
  id_cancion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: 'canciones',
      key: 'id_cancion'
    }
  },
  id_genero: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: 'genero',
      key: 'id_genero'
    }
  }
}, {
  tableName: 'cancion_genero',
  timestamps: false
})

module.exports = { CancionGenero }