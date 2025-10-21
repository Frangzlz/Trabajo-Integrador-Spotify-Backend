// Controlador de Playlists

const { Op } = require("sequelize")
const { Cancion } = require("../models/Cancion")
const { Playlist } = require("../models/Playlist")
const { PlaylistCancion } = require("../models/PlaylistCancion")

const getPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.findAll()

    if (playlists.length === 0) {
      return res.status(404).json({ error: "No se encontraron playlists." })
    }

    const playlistsData = playlists.map(playlist => playlist.dataValues)
    return res.json(playlistsData)
  } catch (error) {
    return res.status(500).json({
      error: 'Server is not running',
      description: error.message
    })
  }
}

const getPlaylistById = async (req, res) => {
  try {
    const { id } = req.params
    const playlist = await Playlist.findByPk(id)

    if (!playlist) {
      return res.status(404).json({ error: "No se encontraro alguna playlist con ese ID." })
    }

    return res.json(playlist)
  } catch (error) {
    return res.status(500).json({
      error: 'Server is not running',
      description: error.message
    })
  }
}

const createPlaylist = async (req, res) => {
  try {
    const {
      titulo,
      id_usuario
    } = req.body

    // Validacion de datos
    if (!titulo || !id_usuario) {
      return res.status(400).send({
        error: 'Faltan valores',
        description: '"titulo" y "id_usuario" deben tener algun valor.'
      })
    }

    const playlistCreated = await Playlist.create({
      titulo,
      id_usuario
    })

    return res.status(201).json({
      message: 'La playlist fue creada correctamente',
      playlist: playlistCreated
    })
  } catch (error) {
    return res.status(500).json({
      error: 'Server is not running',
      description: error.message
    })
  }
}

const softDeleteUpdatePlaylist = async (req, res) => {
  try {
    const { id } = req.params
    const {
      titulo,
      estado,
      fecha_eliminada
    } = req.body

    const playlistExistente = await Playlist.findByPk(id)

    if (!playlistExistente) {
      return res.status(404).json({
        error: 'No se encontro ninguna playlist con este ID.'
      })
    }

    if (estado === 'eliminada') {
      await Playlist.update({
        titulo: titulo || playlistExistente.dataValues.titulo,
        estado,
        fecha_eliminada: fecha_eliminada || new Date()
      }, { where: { id_playlist: id } })

      const playlistUpdated = await Playlist.findByPk(id)

      return res.status(200).json({
        message: 'La playlist se actualizo correctamente.',
        playlist: playlistUpdated
      })
    }

    if (estado === 'activa') {
      await Playlist.update({
        titulo: titulo || playlistExistente.dataValues.titulo,
        estado,
        fecha_eliminada: null
      }, { where: { id_playlist: id } })

      const playlistUpdated = await Playlist.findByPk(id)

      return res.status(200).json({
        message: 'La playlist se actualizo correctamente.',
        playlist: playlistUpdated
      })
    }
    
    if (!titulo || !estado) {
      return res.status(400).send({
        error: 'Faltan valores',
        description: '"titulo" y "estado = ["eliminada" o "activa"]" deben tener valores.'
      })
    }

    await Playlist.update({
      titulo
    })

    const playlistUpdated = await Playlist.findByPk(id)

    return res.status(200).json({
      message: 'La playlist se actualizo correctamente.',
      playlist: playlistUpdated
    })
  } catch (error) {
    return res.status(500).json({
      error: 'Server is not running',
      description: error.message
    })
  }
}

const createPlaylistCancion = async (req, res) => {
  try {
    const { id_playlist } = req.params

    const {
      id_cancion,
      orden
    } = req.body

    // Verificaciones
    if (!id_cancion || !orden) {
      return res.status(400).send({
        error: 'Faltan valores',
        description: '"id_cancion" y "orden" deben tener valores.'
      })
    }

    // Validar existencia de playlist y canción
    const playlistExistente = await Playlist.findByPk(id_playlist)
    if (!playlistExistente) {
      return res.status(404).json({ error: 'No se encontro ninguna playlist con este ID.' })
    }

    const cancionExistente = await Cancion.findByPk(id_cancion)
    if (!cancionExistente) {
      return res.status(404).json({ error: 'No se encontro el ID de la cancion.' })
    }

    const asociacionPlaylistCancion = await PlaylistCancion.findOne({
      where: { id_playlist, id_cancion }
    })
    if (asociacionPlaylistCancion) {
      return res.status(400).json({ error: 'Ya existe esta Cancion dentro de esta Playlist.' })
    }

    // Aumentar el orden
    await PlaylistCancion.increment(
      { orden: 1 },
      { 
        where: {
          id_playlist: Number(id_playlist),
          orden: { [Op.gte]: orden }
        }
      }
    )

    // Crear la asociacion
    const playlistCancionCreated = await PlaylistCancion.create({
      id_playlist: Number(id_playlist),
      id_cancion,
      orden
    })

    // Actualizar contador de canciones
    playlistExistente.cant_canciones += 1
    await playlistExistente.save()

    return res.status(201).json({
      message: 'La Cancion fue guardada correctamente en la Playlist',
      playlist: playlistCancionCreated
    })
  } catch (error) {
    return res.status(500).json({
      error: 'Server is not running',
      description: error.message
    })
  }
}

const deletePlaylistCancion = async (req, res) => {
  try {
    const { id_playlist, id_cancion } = req.params
  
    const playlistCancionToDelete = await PlaylistCancion.findOne({
      where: { id_playlist, id_cancion }
    })
  
    if (!playlistCancionToDelete) {
      return res.status(404).json({ error: 'No existe ninguna Cancion asociada a esta Playlist.' })
    }
  
    const ordenDeleted = playlistCancionToDelete.dataValues.orden
  
    await playlistCancionToDelete.destroy()
  
    await PlaylistCancion.decrement(
      { orden: 1 },
      { 
        where: {
          id_playlist,
          orden: { [Op.gt]: ordenDeleted }
        } 
      }
    )

    return res.status(200).json({
      message: 'La Cancion fue eliminada de la Playlist correctatamente.',
      eliminada: { 
        id_playlist: Number(id_playlist),
        id_cancion: Number(id_cancion)
      } 
    })
  } catch (error) {
    return res.status(500).json({
      error: 'Server is not running',
      description: error.message
    })
  }
}

module.exports = {
  getPlaylists,
  getPlaylistById,
  createPlaylist,
  softDeleteUpdatePlaylist,
  createPlaylistCancion,
  deletePlaylistCancion
}