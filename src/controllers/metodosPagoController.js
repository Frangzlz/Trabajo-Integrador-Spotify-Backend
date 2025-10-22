// Controlador de Métodos de Pago

const { MetodoPago } = require("../models/MetodoPago")

const getMetodoPagoById = async (req, res) => {
  try {
    const { usuarioId } = req.query

    if (!usuarioId) {
      return res.status(400).json({ error: '"usuarioId" debe tener algun valor.' })
    }
  
    const metodosDePagoDeUsuario = await MetodoPago.findAll(
      { where: { id_usuario: usuarioId } }
    )
  
    if (metodosDePagoDeUsuario.length === 0) {
      return res.status(404).json({ error: "No se encontro ningun metodo de pago con este ID de usuario." })
    }
    
    return res.json(metodosDePagoDeUsuario)
  } catch (error) {
    return res.status(500).json({
      error: 'Server is not running',
      description: error.message
    })
  }
}

const createMetodoPago = async (req, res) => {
  try {
    const {
      id_usuario,
      tipo_forma_pago,
      cbu,
      banco_codigo,
      nro_tarjeta,
      mes_caduca,
      anio_caduca
    } = req.body

    // Validaciones generales
    if (!id_usuario || !tipo_forma_pago) {
      return res.status(400).send({
        error: 'Faltan valores',
        description: '"id_usuario" e "tipo_forma_pago" deben tener valores.'
      })
    }

    const formasValidas = [
      'Efectivo',
      'Tarjeta de crédito',
      'Tarjeta de débito',
      'Débito automático x banco'
    ]

    if (!formasValidas.includes(tipo_forma_pago)) {
      return res.status(400).json({
        error: 'Tipo de forma de pago invalido.',
        description: 'Debe ser una de las siguientes formas de pago.',
        forma_de_pago: formasValidas
      })
    }

    let nro_tarjeta_masc = ''
    if (nro_tarjeta && nro_tarjeta.length === 16) {
      nro_tarjeta_masc = `**** **** **** ${nro_tarjeta.slice(-4)}`
    }

    let cbu_masc = ''
    if (cbu && cbu.length === 22) {
      cbu_masc = '*'.repeat(cbu.length - 4) + cbu.slice(-4)
    }

    const metodoPagoCreated = await MetodoPago.create({
      id_usuario,
      tipo_forma_pago,
      cbu: cbu_masc || null,
      banco_codigo: banco_codigo || 0,
      nro_tarjeta_masc: nro_tarjeta_masc || null,
      mes_caduca: mes_caduca || null,
      anio_caduca: anio_caduca || null
    })

    return res.status(201).json({
      message: 'Metodo de Pago creado correctamente.',
      metodoPago: metodoPagoCreated
    })
  } catch (error) {
    return res.status(500).json({
      error: 'Server is not running',
      description: error.message
    })
  }
}

module.exports = {
  getMetodoPagoById,
  createMetodoPago
}