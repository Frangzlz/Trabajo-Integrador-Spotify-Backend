/**
 * Configuración principal de la aplicación Express
 * Los estudiantes deben completar la configuración de middlewares y rutas
 */

const express = require("express");
const router = require("./routes/index");
const sequelize = require("./config/database");
const { Artista } = require("./models/Artista");
const { Usuario } = require("./models/Usuario");
const { Album } = require("./models/Album");
const { Cancion } = require("./models/Cancion");
const { Genero } = require("./models/Genero");
const { CancionGenero } = require("./models/CancionGenero");
const { Playlist } = require("./models/Playlist");
const { PlaylistCancion } = require("./models/PlaylistCancion");
const { Suscripcion } = require("./models/Suscripcion");
const { MetodoPago } = require("./models/MetodoPago");

// TODO: Importar las rutas

const app = express();

app.disable('x-powered-by')

// TODO: Configurar parseo de JSON
// Ejemplo: app.use(express.json());
app.use(express.json())

// Autenticacion
app.use(async (req, res, next) => {
  try {
    await sequelize.authenticate()
    await Artista.sync()
    await Usuario.sync()
    await Album.sync()
    await Cancion.sync()
    await Genero.sync()
    await CancionGenero.sync()
    await Playlist.sync()
    await PlaylistCancion.sync()
    await Suscripcion.sync()
    await MetodoPago.sync()
    next()
  } catch (err) {
    res.status(500).json({
      error: 'Error en el servidor',
      description: err.message
    })
  }
})

// TODO: Configurar rutas
// Ejemplo: app.use('/api/v1/usuarios', usuariosRoutes);
app.use('/api/v1', router)

// TODO: Configurar middleware de manejo de errores (debe ir al final)

// TODO: Configurar ruta 404

module.exports = app;
