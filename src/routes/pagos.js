// Rutas para pagos

const express = require("express");
const { getPagosById, createPago } = require("../controllers/pagosController");
const router = express.Router();

router.get('/', getPagosById)

router.post('/', createPago)

module.exports = router