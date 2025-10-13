// Controlador de Usuarios

const { Usuario } = require("../models/Usuario")
const { Op } = require("sequelize")
const bcryptjs = require("bcryptjs")

const getUsuarios = async (req, res) => {
  try {
    // Paginacion (Page, Limit y Offset)
    const { page, limit } = req.query
    console.log(page, limit)

    if (page || limit) {
      const pageInt = parseInt(page) || 1
      const limitInt = parseInt(limit) || 20
      const offset = (page - 1) * limit

      const { count, rows } = await Usuario.findAndCountAll({
        limit: limitInt,
        offset,
        order: [['id_usuario', 'ASC']]
      })

      if (rows.length === 0) {
        return res.status(404).json({ error: "No se encontraron más usuarios" })
      }

      // Calcular total de páginas
      const totalPages = Math.ceil(count / limit)

      return res.json({
        page: pageInt,
        totalPages,
        totalUsuarios: count,
        usuarios: rows
      })
    }

    // Lista normal, con todos los usuarios
    const usuarios = await Usuario.findAll()
    if (usuarios.length === 0) {
      return res.status(404).json({ error: "No se encontraron usuarios" })
    }
    
    const usuariosData = usuarios.map(usuario => usuario.dataValues)
    return res.json(usuariosData)
  } catch (error) {
    return res.status(500).json({
      error: 'Server is not running',
      description: error.message
    })
  }
}

const getUsuarioById = async (req, res) => {
  try {
    const { id } = req.params

    const usuario = await Usuario.findByPk(id)
    if (!usuario) {
      return res.status(404).json({ error: "No se encontro al usuario" })
    }
    
    return res.json(usuario)
  } catch (error) {
    return res.status(500).json({
      error: 'Server is not running',
      description: error.message
    })
  }
}

const getUsuariosPasswordVencidas = async (req, res) => {
  try {
    const hoy = new Date()
    const limite = new Date().setDate(hoy.getDate() - 90)

    const usuarios = await Usuario.findAll({
      where: {
        cambio_de_password: {
          [Op.lte]: limite
        }
      },
      order: [['cambio_de_password', 'ASC']]
    })

    if (usuarios.length === 0) {
      return res.status(404).json({ error: "No se encontraron usuarios con contraseñas vencidas (90 dias)." })
    }

    return res.status(200).json({
      total: usuarios.length,
      fecha_limite: new Date(limite).toISOString().split('T')[0],
      usuarios
    })
  } catch (error) {
    return res.status(500).json({
      error: 'Server is not running',
      description: error.message
    })
  }
}

const createUsuario = async (req, res) => {
  try {
    const {
      id_pais,
      tipo_usuario_actual,
      usuario,
      nom_y_ape,
      email,
      fecha_nac,
      sexo,
      cp,
      password,
      cambio_de_password
    } = req.body

    // Validaciones
    if (!usuario || !email || !password || !id_pais || !tipo_usuario_actual) {
      return res.status(400).send({
        error: 'Faltan valores',
        description: '"usuario", "email", "password", "id_pais" y "tipo_usuario_actual" deben tener valores.'
      })
    }

    // Validaciones por valores unicos
    const usuarioExistente = await Usuario.findOne({ where: { usuario } })
    if (usuarioExistente) {
      return res.status(409).json({
        error: 'Usuario duplicado',
        description: 'Ya existe un usuario con ese nombre.'
      })
    }

    const emailExistente = await Usuario.findOne({ where: { email } })
    if (emailExistente) {
      return res.status(409).json({
        error: 'Email duplicado',
        description: 'Ya existe un usuario con ese email.'
      })
    }

    // Hash de password
    const saltRounds = 10
    const password_hash = await bcryptjs.hash(password, saltRounds)

    const usuarioCreated = await Usuario.create({
      usuario,
      nom_y_ape,
      email,
      password_hash,
      fecha_nac,
      sexo,
      cp,
      id_pais,
      tipo_usuario_actual,
      cambio_de_password: new Date()
    })

    res.status(201).json({
      message: 'Usuario creado correctamente.',
      usuario: usuarioCreated
    })

  } catch (error) {
    return res.status(500).json({
      error: 'Server is not running',
      description: error.message
    })
  }
}

const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params

    // Verificar si el usuario existe
    const usuario = await Usuario.findByPk(id)
    if (!usuario) {
      return res.status(404).json({ error: 'No se encontro el ID del usuario' })
    }

    // Eliminar
    await usuario.destroy()

    return res.status(200).json({
      message: 'Usuario eliminado correctamente.',
      id_eliminado: id
    })

  } catch (error) {
    return res.status(500).json({
      error: 'Server is not running',
      description: error.message
    })
  }
}

const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params
    const { password, ...data } = req.body
    const dataToUpdate = { ...data }
  
    // Verificar si el usuario existe
    const usuario = await Usuario.findByPk(id)
    if (!usuario) {
      return res.status(404).json({ error: 'No se encontro el ID del usuario' })
    }
  
    // Logica Hash Password
    if (password) {
      const saltRounds = 10
      const password_hash = await bcryptjs.hash(password, saltRounds)
      dataToUpdate.password_hash = password_hash
      dataToUpdate.cambio_de_password = new Date()
    }
  
    await Usuario.update(dataToUpdate, { where: { id_usuario: id } })
  
    const usuarioUpdated = await Usuario.findByPk(id)
  
    return res.status(200).json({
      message: 'Usuario actualizado correctamente.',
      usuario: usuarioUpdated
    })
  } catch (error) {
    return res.status(500).json({
      error: 'Server is not running',
      description: error.message
    })
  }
}

module.exports = { 
  getUsuarios,
  getUsuarioById,
  getUsuariosPasswordVencidas,
  createUsuario,
  deleteUsuario,
  updateUsuario
}