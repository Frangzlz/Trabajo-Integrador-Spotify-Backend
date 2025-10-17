// Modelo Cancion

const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Cancion = sequelize.define('cancion', {
  id_cancion: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  titulo: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  duracion_seg: { 
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_album: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'albums',
      key: 'id_album'
    }
  },
  reproducciones: {
    type: DataTypes.BIGINT,
    defaultValue: 0
  },
  likes: {
    type: DataTypes.BIGINT,
    defaultValue: 0
  },
  fecha_agregada: {
    type: DataTypes.DATE,
    default: DataTypes.NOW
  }
}, {
  tableName: 'canciones',
  timestamps: false
})

module.exports = { Cancion }