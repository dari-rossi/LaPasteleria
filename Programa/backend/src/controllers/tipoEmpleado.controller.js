const tipoEmpleadoService = require("../services/tipoEmpleado.service");
const { leerId } = require("../config/errores");

const obtenerTiposEmpleado = async (req, res) => {
    const tipos = await tipoEmpleadoService.obtenerTiposEmpleado(req.query.rol, req.usuario);
    res.json(tipos);
};

const obtenerTipoEmpleadoPorId = async (req, res) => {
    const id = leerId(req.params.id);
    const tipo = await tipoEmpleadoService.obtenerTipoEmpleadoPorId(id);
    res.json(tipo);
};

const crearTipoEmpleado = async (req, res) => {
    const tipo = await tipoEmpleadoService.crearTipoEmpleado(req.body);
    res.status(201).json(tipo);
};

const modificarTipoEmpleado = async (req, res) => {
    const id = leerId(req.params.id);
    const tipo = await tipoEmpleadoService.modificarTipoEmpleado(id, req.body);
    res.json(tipo);
};

const eliminarTipoEmpleado = async (req, res) => {
    const id = leerId(req.params.id);
    await tipoEmpleadoService.eliminarTipoEmpleado(id);
    res.json({ mensaje: "Tipo de empleado eliminado" });
};

module.exports = {
    obtenerTiposEmpleado,
    obtenerTipoEmpleadoPorId,
    crearTipoEmpleado,
    modificarTipoEmpleado,
    eliminarTipoEmpleado
};