// Controlador de Artistas

const { Artista } = require("../models/Artista")

const getAllArtistas = async (req, res) => {
  try {
    const artistas = await Artista.findAll()
    if (artistas.length === 0) {
      return res.status(404).json({ error: "No se encontraron productos" })
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

module.exports = {
  getAllArtistas
}