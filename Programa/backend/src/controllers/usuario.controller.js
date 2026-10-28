const usuarioService = require("../services/usuario.service");
const { leerId } = require("../config/errores");

const obtenerUsuarios = async (req, res) => {
    const sucursalId = req.query.sucursalId !== undefined
        ? leerId(req.query.sucursalId)
        : undefined;

    const usuarios = await usuarioService.obtenerUsuarios(sucursalId);
    res.json(usuarios);
};

const obtenerUsuarioPorId = async (req, res) => {
    const id = leerId(req.params.id);
    const usuario = await usuarioService.obtenerUsuarioPorId(id);
    res.json(usuario);
};

const crearUsuario = async (req, res) => {
    const usuario = await usuarioService.crearUsuario(req.body);
    res.status(201).json(usuario);
};

const modificarUsuario = async (req, res) => {
    const id = leerId(req.params.id);
    const usuario = await usuarioService.modificarUsuario(id, req.body, req.usuario);
    res.json(usuario);
};

const eliminarUsuario = async (req, res) => {
    const id = leerId(req.params.id);
    await usuarioService.eliminarUsuario(id, req.usuario);
    res.json({ mensaje: "Usuario eliminado" });
};

module.exports = {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    modificarUsuario,
    eliminarUsuario
};