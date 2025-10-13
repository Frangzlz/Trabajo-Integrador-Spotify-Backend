// Rutas para artistas

const { 
  getAllArtistas, 
  getArtistaById, 
  createArtista
} = require('../controllers/artistasController')
const express = require("express");
const router = express.Router();

router.get('/', getAllArtistas)
router.get('/:id', getArtistaById)

router.post('/', createArtista)

module.exports = router