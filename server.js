/**
 * Punto de entrada del servidor
 * Los estudiantes deben completar la configuración del servidor Express
 */

const app = require("./src/app");

process.loadEnvFile()
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor escuchando: http://localhost:${PORT}`)
})

// TODO: Agregar manejo de errores del servidor
// TODO: Agregar logs de inicio del servidor
