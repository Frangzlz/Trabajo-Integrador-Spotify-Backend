// Modelo MetodoPago

const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const MetodoPago = sequelize.define('metodopago', {
  id_metodo_pago: {
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
  tipo_forma_pago: {
    type: DataTypes.ENUM('Efectivo', 'Tarjeta de crédito', 'Tarjeta de débito', 'Débito automático x banco'),
    allowNull: false
  },
  cbu: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  banco_codigo: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  nro_tarjeta_masc: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  mes_caduca: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 12
    }
  },
  anio_caduca: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'metodo_pago',
  timestamps: false
})

module.exports = { MetodoPago }