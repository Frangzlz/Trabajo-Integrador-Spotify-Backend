// Controlador de Canciones

const { Album } = require("../models/Album")
const { Cancion } = require("../models/Cancion")
const { CancionGenero } = require("../models/CancionGenero")
const { Genero } = require("../models/Genero")

const getCanciones = async (req, res) => {
    try {
    const { genero, artistaId, albumId } = req.query

    let canciones = await Cancion.findAll()

    // Filtro por album
    if (albumId) {
      canciones = canciones.filter(cancion => cancion.id_album == albumId)
    }

    // Filtro por artista
    if (artistaId) {
      const albums = await Album.findAll({ where: { id_artista: artistaId } })
      const idsAlbums = albums.map(album => album.id_album)
      canciones = canciones.filter(cancion => idsAlbums.includes(cancion.id_album))
    }

    // Filtro por género
    if (genero) {
      const generoEncontrado = await Genero.findOne({ where: { nombre: genero } })

      if (generoEncontrado) {
        // Buscamos las relaciones en la tabla intermedia
        const relaciones = await CancionGenero.findAll({
          where: { id_genero: generoEncontrado.id_genero }
        })
        const idsCanciones = relaciones.map(relacion => relacion.id_cancion)
        canciones = canciones.filter(cancion => idsCanciones.includes(cancion.id_cancion))
      } else {
        canciones = [] // No existe ese género
      }
    }

    if (canciones.length === 0) {
      return res.status(404).json({ error: "No se encontraron canciones." })
    }

    return res.json(canciones)
  } catch (error) {
    return res.status(500).json({
      error: 'Server is not running',
      description: error.message
    })
  }
}

const getCancionById = async (req, res) => {
  try {
    const { id } = req.params

    const cancion = await Cancion.findByPk(id)
    if (!cancion) {
      return res.status(404).json({ error: "No se encontro la cancion con ese ID." })
    }
    
    return res.json(cancion)
  } catch (error) {
    return res.status(500).json({
      error: 'Server is not running',
      description: error.message
    })
  }
}

const createCancion = async (req, res) => {
  try {
    const {
      titulo,
      duracion_seg,
      id_album,
      reproducciones,
      likes
    } = req.body
  
    // Validaciones generales
    if (!titulo || duracion_seg == null || !id_album) {
      return res.status(400).send({
        error: 'Faltan valores',
        description: '"titulo", "duracion_seg" y "id_album" deben tener valores.'
      })
    }
  
    // Validaciones unicas
    if (!Number.isInteger(duracion_seg)) {
      return res.status(400).send({
        error: '"duracion_seg" tiene que ser un numero entero.'
      })
    }

    if (duracion_seg <= 0) {
      return res.status(400).send({
        error: '"duracion_seg" tiene que ser mayor a 0.'
      })
    }
  
    const albumExistente = await Album.findByPk(id_album)
    if (!albumExistente) {
      return res.status(404).send({
        error: 'No existe ningun album con este ID.'
      })
    }
  
    // Crear cancion
    const cancionCreated = await Cancion.create({
      titulo,
      duracion_seg,
      id_album,
      reproducciones,
      likes
    })

    return res.status(201).json({
      message: 'Cancion creada correctamente.',
      cancion: cancionCreated
    })
  } catch (error) {
    return res.status(500).json({
      error: 'Server is not running',
      description: error.message
    })
  }
}

const createAsociacionCancionGenero = async (req, res) => {
  try {
    const { id } = req.params
    const { id_genero } = req.body

    // Validaciones
    if (!id_genero) {
      return res.status(400).send({
        error: 'Faltan valores',
        description: '"id_genero" debe tener algun valor.'
      })
    }

    const cancionExistente = await Cancion.findByPk(id)
    if (!cancionExistente) {
      return res.status(404).json({ error: 'No se encontro el ID de la cancion.' })
    }

    const generoExistente = await Genero.findByPk(id_genero)
    if (!generoExistente) {
      return res.status(404).json({ error: 'No se encontro el ID de este genero.' })
    }

    const asociacionExistente = await CancionGenero.findOne(
      { where: { id_cancion: id, id_genero } }
    )
    if (asociacionExistente) {
      return res.status(400).json({ error: 'Ya existe esta asociacion entre Cancion y Genero.' })
    }
  
    // Crear asociacion
    const cancionGeneroCreated = await CancionGenero.create({
      id_cancion: Number.parseInt(id),
      id_genero: Number.parseInt(id_genero)
    })
  
    return res.status(201).json({
      message: 'Asociacion entre Cancion y Genero creada correctamente.',
      cancion_genero: cancionGeneroCreated
    })
  } catch (error) {
    return res.status(500).json({
      error: 'Server is not running',
      description: error.message
    })
  }
}

const deleteAsociacionCancionGenero = async (req, res) => {
  try {
    const { id_cancion, id_genero } = req.params

    if (isNaN(id_cancion) || isNaN(id_genero)) {
      return res.status(400).json({
        error: '"id_cancion" e "id_genero" deben ser numeros enteros.'
      })
    }

    const asociacionToDelete = await CancionGenero.findOne({
      where: { id_cancion, id_genero }
    })

    if (!asociacionToDelete) {
      return res.status(404).json({ error: 'No existe ninguna Cancion asociada a este Genero' })
    }

    await asociacionToDelete.destroy()

    return res.status(200).json({
      message: 'La asociacion entre esta Cancion y su Genero fueron eliminadas correctamente.',
      asociacion: { id_cancion, id_genero }
    })
  } catch (error) {
    return res.status(500).json({
      error: 'Server is not running',
      description: error.message
    })
  }
}

const updateCancion = async (req, res) => {
  try {
    const { id } = req.params
    const { ...data } = req.body
    const dataToUpdate = { ...data }

    const cancionExistente = await Cancion.findByPk(id)
    if (!cancionExistente) {
      return res.status(404).json({ error: 'No se encontro el ID de la cancion.' })
    }

    await Cancion.update(dataToUpdate, { where: { id_cancion: id } })

    const cancionUpdated = await Cancion.findByPk(id)
  
    return res.status(200).json({
      message: 'Cancion actualizada correctamente.',
      cancion: cancionUpdated
    })
  } catch (error) {
    return res.status(500).json({
      error: 'Server is not running',
      description: error.message
    })
  }
}

module.exports = {
  getCanciones,
  getCancionById,
  createCancion,
  createAsociacionCancionGenero,
  deleteAsociacionCancionGenero,
  updateCancion
}