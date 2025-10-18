// Rutas para canciones

const express = require("express");
const { 
  getCanciones,
  getCancionById,
  createCancion,
  createAsociacionCancionGenero,
  deleteAsociacionCancionGenero,
  updateCancion
} = require("../controllers/cancionesController");
const router = express.Router();

router.get('/', getCanciones)
router.get('/:id', getCancionById)

router.post('/', createCancion)
router.post('/:id/generos', createAsociacionCancionGenero)

router.put('/:id', updateCancion)

router.delete('/:id_cancion/generos/:id_genero', deleteAsociacionCancionGenero)

module.exports = router