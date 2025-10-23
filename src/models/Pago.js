// Modelo Pago

const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Pago = sequelize.define('pago', {
  id_pago: {
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
  id_suscripcion: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'suscripciones',
      key: 'id_suscripcion'
    }
  },
  id_metodo_pago: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'metodo_pago',
      key: 'id_metodo_pago'
    }
  },
  importe: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  fecha_pago: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'pagos',
  timestamps: false
})

module.exports = { Pago }