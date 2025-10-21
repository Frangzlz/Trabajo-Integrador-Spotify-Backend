// Controlador de Géneros

const { Genero } = require("../models/Genero")

const getGeneros = async (req, res) => {
  try {
    const generos = await Genero.findAll({
      order: [
        ['id_genero', 'ASC']
      ] 
    })

    if (generos.length === 0) {
      return res.status(404).json({ error: "No se encontraron generos." })
    }

    const generosData = generos.map(genero => genero.dataValues)
    return res.json(generosData)
  } catch (error) {
    return res.status(500).json({
      error: 'Server is not running',
      description: error.message
    })
  }
}

const createGenero = async (req, res) => {
  try {
    const { nombre } = req.body

    // Validacion de datos
    if (!nombre) {
      return res.status(400).send({
        error: 'Faltan valores',
        description: '"nombre" debe tener algun valor.'
      })
    }

    // Validacion por nombre unico
    const generoExistente = await Genero.findOne({
      where: { nombre }
    })
    
    if (generoExistente) {
      return res.status(409).json({
        error: 'Duplicado',
        message: 'Ya existe este genero en la base de datos.'
      })
    }

    const generoCreated = await Genero.create({
      nombre
    })

    res.status(201).json({
      message: 'Genero creado correctamente.',
      genero: generoCreated
    })
  } catch (error) {
    return res.status(500).json({
      error: 'Server is not running',
      description: error.message
    })
  }
}

module.exports = {
  getGeneros,
  createGenero
}