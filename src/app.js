/**
 * Configuración principal de la aplicación Express
 * Los estudiantes deben completar la configuración de middlewares y rutas
 */

const express = require("express");
const router = require("./routes/index");

// TODO: Importar las rutas

const app = express();

app.disable('x-powered-by')

// TODO: Configurar parseo de JSON
// Ejemplo: app.use(express.json());
app.use(express.json())

// TODO: Configurar rutas
// Ejemplo: app.use('/api/v1/usuarios', usuariosRoutes);
app.use('/api/v1', router)

// TODO: Configurar middleware de manejo de errores (debe ir al final)

// TODO: Configurar ruta 404

module.exports = app;
