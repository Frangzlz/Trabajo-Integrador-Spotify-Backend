// Controlador de Suscripciones

const { Suscripcion } = require("../models/Suscripcion")

const getSuscripciones = async (req, res) => {
  try {
    const suscripciones = await Suscripcion.findAll()
    if (suscripciones.length === 0) {
      return res.status(404).json({ error: 'No se encontraron suscripciones en la base de datos.' })
    }

    const suscripcionesData = suscripciones.map(suscripcion => suscripcion.dataValues)
    return res.json(suscripcionesData)
  } catch (error) {
    return res.status(500).json({
      error: 'Server is not running',
      description: error.message
    })
  }
}

const getSuscripcionById = async (req, res) => {
  try {
    const { id } = req.params

    const suscripcion = await Suscripcion.findByPk(id)
    if (!suscripcion) {
      return res.status(404).json({ error: "No se encontro ninguna suscripcion con este ID." })
    }

    return res.json(suscripcion)
  } catch (error) {
    return res.status(500).json({
      error: 'Server is not running',
      description: error.message
    })
  }
}

const createSuscripcion = async (req, res) => {
  try {
    const {
      id_usuario,
      id_tipo_usuario,
      fecha_inicio,
      fecha_renovacion
    } = req.body

    // Validaciones
    if (!id_usuario || !id_tipo_usuario || !fecha_inicio || !fecha_renovacion) {
      return res.status(400).send({
        error: 'Faltan valores',
        description: '"id_usuario", "id_tipo_usuario", "fecha_inicio" y "fecha_renovacion" deben tener valores.'
      })
    }

    if (new Date(fecha_renovacion) <= new Date(fecha_inicio)) {
      return res.status(400).send({
        error: 'La fecha de renovacion debe ser posterior a la fecha de inicio.'
      })
    }

    // Validar valores Unicos
    const suscripcionExistente = await Suscripcion.findOne({
      where: { id_usuario, fecha_inicio }
    })
    if (suscripcionExistente) {
      return res.status(400).json({
        error: 'Ya existe esta suscripcion con esta fecha de inicio para este usuario.'
      })
    }

    const suscripcionCreated = await Suscripcion.create({
      id_usuario,
      id_tipo_usuario,
      fecha_inicio,
      fecha_renovacion
    })

    return res.status(201).json(suscripcionCreated)
  } catch (error) {
    return res.status(500).json({
      error: 'Server is not running',
      description: error.message
    })
  }
}

module.exports = {
  getSuscripciones,
  getSuscripcionById,
  createSuscripcion
}