// Rutas para usuarios

const { 
  getUsuarios, 
  createUsuario, 
  deleteUsuario, 
  updateUsuario,
  getUsuarioById,
  getUsuariosPasswordVencidas
} = require("../controllers/usuariosController");
const express = require("express");
const router = express.Router();

router.get('/', getUsuarios)
router.get('/password-vencidas', getUsuariosPasswordVencidas)
router.get('/:id', getUsuarioById)

router.post('/', createUsuario)

router.delete('/:id', deleteUsuario)

router.put('/:id', updateUsuario)

module.exports = router
