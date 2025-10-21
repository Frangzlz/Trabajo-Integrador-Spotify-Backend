// Modelo PlaylistCancion

const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const PlaylistCancion = sequelize.define('playlistcancion', {
  id_playlist: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'playlists',
      key: 'id_playlist'
    }
  },
  id_cancion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'canciones',
      key: 'id_cancion'
    }
  },
  orden: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  fecha_agregada: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'playlist_cancion',
  timestamps: false
})

module.exports = { PlaylistCancion }