// Modelo Album

const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Album = sequelize.define('album', {
  id_album: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nombre_album: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  id_artista: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'artistas',
      key: 'id_artista'
    }
  },
  id_discografica: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'discograficas',
      key: 'id_discografica'
    }
  },
  imagen_portada: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: ''
  },
  anio_publicacion: {
    type: DataTypes.INTEGER,
    validate: {
      isInt: true,
      len: [4, 4]
    },
    allowNull: false,
    defaultValue: ''
  },
  duracion_total_seg: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  }
}, {
  tableName: 'albums',
  timestamps: false
})

module.exports = { Album }