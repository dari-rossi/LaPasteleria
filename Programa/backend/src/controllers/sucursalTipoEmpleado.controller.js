const sucursalTipoEmpleadoService = require("../services/sucursalTipoEmpleado.service");
const { leerId } = require("../config/errores");

const obtenerTiposEmpleadoDeSucursal = async (req, res) => {
    const sucursalId = leerId(req.params.sucursalId);
    const asignaciones = await sucursalTipoEmpleadoService.obtenerTiposEmpleadoDeSucursal(sucursalId, req.usuario);
    res.json(asignaciones);
};

const asignarTipoEmpleado = async (req, res) => {
    const sucursalId = leerId(req.params.sucursalId);
    const asignacion = await sucursalTipoEmpleadoService.asignarTipoEmpleado(sucursalId, req.body, req.usuario);
    res.status(201).json(asignacion);
};

const modificarCantidad = async (req, res) => {
    const sucursalId = leerId(req.params.sucursalId);
    const tipoEmpleadoId = leerId(req.params.tipoEmpleadoId);
    const asignacion = await sucursalTipoEmpleadoService.modificarCantidad(sucursalId, tipoEmpleadoId, req.body, req.usuario);
    res.json(asignacion);
};

const quitarTipoEmpleado = async (req, res) => {
    const sucursalId = leerId(req.params.sucursalId);
    const tipoEmpleadoId = leerId(req.params.tipoEmpleadoId);
    await sucursalTipoEmpleadoService.quitarTipoEmpleado(sucursalId, tipoEmpleadoId, req.usuario);
    res.json({ mensaje: "Tipo de empleado quitado de la sucursal" });
};

module.exports = {
    obtenerTiposEmpleadoDeSucursal,
    asignarTipoEmpleado,
    modificarCantidad,
    quitarTipoEmpleado
};