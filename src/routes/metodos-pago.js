// Rutas para métodos de pago

const express = require("express");
const { getMetodoPagoById, createMetodoPago } = require("../controllers/metodosPagoController");
const router = express.Router();

router.get('/', getMetodoPagoById)

router.post('/', createMetodoPago)

module.exports = router