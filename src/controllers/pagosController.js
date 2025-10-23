// Controlador de Pagos

const { Op } = require("sequelize")
const { Pago } = require("../models/Pago")
const { Suscripcion } = require("../models/Suscripcion")
const { MetodoPago } = require("../models/MetodoPago")
const { Usuario } = require("../models/Usuario")

const getPagosById = async (req, res) => {
  try {
    const {
      usuarioId,
      desde,
      hasta
    } = req.query

    if (!usuarioId || !desde || !hasta) {
      return res.status(400).json({ error: '"usuarioId", "desde" y "hasta" deben tener algun valor.' })
    }

    const pagos = await Pago.findAll({
      where: {
        id_usuario: usuarioId, fecha_pago: { [Op.between]: [new Date(desde), new Date(hasta)] }
      }
    })

    if (pagos.length === 0) {
      return res.status(404).json({ message: 'No se encontraron pagos con esos filtros.' })
    }

    return res.status(200).json({
      total: pagos.length,
      pagos
    })
  } catch (error) {
    return res.status(500).json({
      error: 'Server is not running',
      description: error.message
    })
  }
}

const createPago = async (req, res) => {
  try {
    const {
      id_usuario,
      id_suscripcion,
      id_metodo_pago,
      importe,
      fecha_pago
    } = req.body

    if (!id_usuario || !id_suscripcion || !id_metodo_pago || !fecha_pago) {
      return res.status(400).json({ error: '"id_usuario", "id_suscripcion", "id_metodo_pago" y "fecha_pago" deben tener algun valor.' })
    }

    const usuarioExistente = await Usuario.findByPk(id_usuario)
    if (!usuarioExistente) {
      return res.status(404).json({ error: 'No se encontro ningun Usuario con este ID.' })
    }

    const suscripcionExistente = await Suscripcion.findByPk(id_suscripcion)
    if (!suscripcionExistente) {
      return res.status(404).json({ error: 'No se encontro ninguna Suscripcion con este ID.' })
    }

    const metodoPagoExistente = await MetodoPago.findByPk(id_metodo_pago)
    if (!metodoPagoExistente) {
      return res.status(404).json({ error: 'No se encontro ningun Metodo de Pago con este ID.' })
    }

    const pagoExistente = await Pago.findOne({
      where: { id_usuario, id_suscripcion, id_metodo_pago }
    })
    if (pagoExistente) {
      return res.status(409).json({ error: 'Ya existe este Pago en la base de datos.' })
    }

    const pagoCreated = await Pago.create({
      id_usuario,
      id_suscripcion,
      id_metodo_pago,
      importe: importe || 0,
      fecha_pago
    })

    return res.status(201).json({
      message: 'El pago fue creado correctamente.',
      pago: pagoCreated
    })
  } catch (error) {
    return res.status(500).json({
      error: 'Server is not running',
      description: error.message
    })
  }
}

module.exports = {
  getPagosById,
  createPago
}