// Modelo Playlist

const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Playlist = sequelize.define('playlist', {
  id_playlist: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  titulo: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id_usuario'
    }
  },
  cant_canciones: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  estado: {
    type: DataTypes.ENUM('activa', 'eliminada'),
    defaultValue: 'activa'
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  fecha_eliminada: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'playlists',
  timestamps: false,
})

module.exports = { Playlist }