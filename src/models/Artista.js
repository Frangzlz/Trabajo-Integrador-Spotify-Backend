// Modelo Artista

const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Artista = sequelize.define('artista', {
  id_artista: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nombre_artista: {
    type: DataTypes.STRING(200),
    unique: true,
    allowNull: false
  },
  imagen_url: {
    type: DataTypes.STRING(250),
    allowNull: true,
    defaultValue: ''
  }
}, {
  timestamps: false,
  tableName: 'artistas'
})

module.exports = { Artista }