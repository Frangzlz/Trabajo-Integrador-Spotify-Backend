// Rutas para álbumes

const express = require("express");
const { 
  getAlbums,
  getAlbumById,
  createAlbum,
  getAlbumCanciones
} = require("../controllers/albumesController");
const router = express.Router();

router.get('/', getAlbums)
router.get('/:id/canciones', getAlbumCanciones)
router.get('/:id', getAlbumById)

router.post('/', createAlbum)

module.exports = router