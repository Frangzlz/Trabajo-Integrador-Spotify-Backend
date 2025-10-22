/**
 * Rutas para suscripciones
 * Los estudiantes deben implementar todas las rutas relacionadas con suscripciones
 */

const express = require("express");
const { 
  getSuscripciones, 
  getSuscripcionById, 
  createSuscripcion
} = require("../controllers/suscripcionesController");
const router = express.Router();

router.get('/', getSuscripciones)
router.get('/:id', getSuscripcionById)

router.post('/', createSuscripcion)

module.exports = router