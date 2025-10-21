// Rutas para géneros

const express = require("express");
const { getGeneros, createGenero } = require("../controllers/generosController");
const router = express.Router();

router.get('/', getGeneros)

router.post('/', createGenero)

module.exports = router