// Rutas para artistas

const { getAllArtistas } = require('../controllers/artistasController')
const express = require("express");
const router = express.Router();

router.get('/', getAllArtistas)

module.exports = router