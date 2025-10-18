// Controlador de Artistas

const { Artista } = require("../models/Artista")

const getAllArtistas = async (req, res) => {
  try {
    const artistas = await Artista.findAll()
    if (artistas.length === 0) {
      return res.status(404).json({ error: "No se encontraron artistas." })
    }
    
    const artistasData = artistas.map(artista => artista.dataValues)
    return res.json(artistasData)
  } catch (error) {
    return res.status(500).json({
      error: 'Server is not running',
      description: error.message
    })
  }
}

const getArtistaById = async (req, res) => {
  try {
    const { id } = req.params

    const artista = await Artista.findByPk(id)
    if (!artista) {
      return res.status(404).json({ error: "No se encontro al artista." })
    }

    return res.json(artista)
  } catch (error) {
    return res.status(500).json({
      error: 'Server is not running',
      description: error.message
    })
  }
}

const createArtista = async (req, res) => {
  try {
    const {
      nombre_artista,
      imagen_url
    } = req.body

    // Validaciones
    if (!nombre_artista) {
      return res.status(400).send({
        error: 'Faltan valores',
        description: '"nombre_artista" debe tener algun valor.'
      })
    }

    // Validacion por si el nombre esta en uso
    const nombreArtistaExistente = await Artista.findOne({ where: { nombre_artista } })
    if (nombreArtistaExistente) {
      return res.status(409).json({
        error: 'Este nombre de artista ya esta en uso'
      })
    }

    const artistaCreated = await Artista.create({
      nombre_artista,
      imagen_url
    })

    res.status(201).json({
      message: 'Artista creado correctamente.',
      artista: artistaCreated
    })

  } catch (error) {
    return res.status(500).json({
      error: 'Server is not running',
      description: error.message
    })
  }
}

module.exports = {
  getAllArtistas,
  getArtistaById,
  createArtista
}