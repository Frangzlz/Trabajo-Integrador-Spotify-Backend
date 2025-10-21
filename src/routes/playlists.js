// Rutas para playlists

const express = require("express");
const {
  getPlaylists,
  getPlaylistById,
  createPlaylist,
  createPlaylistCancion,
  softDeleteUpdatePlaylist,
  deletePlaylistCancion
} = require("../controllers/playlistsController");
const router = express.Router();

router.get('/', getPlaylists)
router.get('/:id', getPlaylistById)

router.post('/', createPlaylist)
router.post('/:id_playlist/canciones', createPlaylistCancion)

router.put('/:id', softDeleteUpdatePlaylist)

router.delete('/:id_playlist/canciones/:id_cancion', deletePlaylistCancion)

module.exports = router