// Modelo Usuario
// Implementar todas las operaciones CRUD para usuarios

const { DataTypes } = require('sequelize')
const sequelize = require('../config/database') // ajustá el path a tu config real

const Usuario = sequelize.define('usuario', {
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_pais: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'paises',
      key: 'id_pais'
    }
  },
  tipo_usuario_actual: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'tipo_usuario',
      key: 'id_tipo_usuario'
    }
  },
  usuario: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  nom_y_ape: {
    type: DataTypes.STRING(200),
    allowNull: false,
    defaultValue: ''
  },
  email: {
    type: DataTypes.STRING(200),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  fecha_nac: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  sexo: {
    type: DataTypes.CHAR(1),
    allowNull: true,
    validate: {
      isIn: [['M', 'F']]
    }
  },
  cp: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  cambio_de_password: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'usuarios',
  timestamps: false
})

module.exports = { Usuario }