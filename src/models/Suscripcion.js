// Modelo Suscripcion

const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Suscripcion = sequelize.define('suscripcion', {
  id_suscripcion: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id_usuario'
    }
  },
  id_tipo_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'tipo_usuario',
      key: 'id_tipo_usuario'
    }
  },
  fecha_inicio: {
    type: DataTypes.DATE,
    allowNull: false
  },
  fecha_renovacion: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'suscripciones',
  timestamps: false
})

module.exports = { Suscripcion }