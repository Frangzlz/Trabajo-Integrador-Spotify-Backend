// Controlador de Álbumes

const { Album } = require("../models/Album")
const { Cancion } = require("../models/Cancion")

const getAlbums = async (req, res) => {
  try {
    const { artistaId, q } = req.query

    // Buscar albumes por el ID del artista
    if (artistaId) {
      const albumsByArtistaId = await Album.findAll({ where: { id_artista: artistaId } })

      if (albumsByArtistaId.length === 0) {
        return res.status(404).json({ error: "No se encontraron albumes con este Id de artista." })
      }

      return res.json(albumsByArtistaId)
    }

    // Buscar albumes por el nombre
    if (q) {
      const albumsByNombreAlbum = await Album.findAll({ where: { nombre_album: q } })

      if (albumsByNombreAlbum.length === 0) {
        return res.status(404).json({ error: "No se encontraron albumes con este nombre (q)." })
      }

      return res.json(albumsByNombreAlbum)
    }

    // En caso de no haber querys, devolver todos los albums
    const albums = await Album.findAll()
    if (albums.length === 0) {
      return res.status(404).json({ error: "No se encontraron albums." })
    }
    
    const albumsData = albums.map(usuario => usuario.dataValues)
    return res.json(albumsData)
  } catch (error) {
    return res.status(500).json({
      error: 'Server is not running',
      description: error.message
    })
  }
}

const getAlbumById = async (req, res) => {
  try {
    const { id } = req.params

    const album = await Album.findByPk(id)
    if (!album) {
      return res.status(404).json({ error: "No se encontro el album." })
    }
    
    return res.json(album)
  } catch (error) {
    return res.status(500).json({
      error: 'Server is not running',
      description: error.message
    })
  }
}

const getAlbumCanciones = async (req, res) => {
  try {
    const { id } = req.params
    const albumCanciones = await Cancion.findAll({ where: { id_album: id } })
    if (albumCanciones.length === 0) {
      return res.status(404).json({ error: "No se encontraron canciones para este album." })
    }

    return res.json(albumCanciones)
  } catch (error) {
    return res.status(500).json({
      error: 'Server is not running',
      description: error.message
    })
  }
}

const createAlbum = async (req, res) => {
  try {
    const {
      nombre_album,
      id_artista,
      id_discografica,
      anio_publicacion,
      imagen_portada
    } = req.body
  
    // Validaciones generales
    if (!nombre_album || !id_artista || !id_discografica || !anio_publicacion) {
      return res.status(400).send({
        error: 'Faltan valores',
        description: '"nombre_album", "id_artista", "id_discografica" y "anio_publicacion" deben tener valores.'
      })
    }

    // Validacion si ya existe el album con el mismo artista y mismo nombre de album
    const albumArtistaNombre = await Album.findOne({ where: { nombre_album, id_artista } })

    if (albumArtistaNombre) {
      return res.status(400).json({
        error: 'El nombre del album para este artista ya existe en la base de datos.'
      })
    }

    const albumCreated = await Album.create({
      nombre_album,
      id_artista,
      id_discografica,
      anio_publicacion,
      imagen_portada
    })

    return res.status(201).json({
      message: 'Album creado correctamente.',
      album: albumCreated
    })
  } catch (error) {
    return res.status(500).json({
      error: 'Server is not running',
      description: error.message
    })
  }
}

module.exports = {
  getAlbums,
  getAlbumById,
  getAlbumCanciones,
  createAlbum
}