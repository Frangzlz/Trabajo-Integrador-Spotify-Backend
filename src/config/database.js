// Configuración de conexión a la base de datos MySQL

const { Sequelize } = require('sequelize')
const { DATABASE, DBUSER, PASSWORD, HOST } = process.env

const sequelize = new Sequelize(DATABASE, DBUSER, PASSWORD, {
  host: HOST,
  dialect: 'mysql'
})

module.exports = sequelize