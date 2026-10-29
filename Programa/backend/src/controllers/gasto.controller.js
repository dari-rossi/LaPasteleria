const gastoService = require("../services/gasto.service");
const { leerId } = require("../config/errores");

const obtenerGastos = async (req, res) => {
    const sucursalId = req.query.sucursalId !== undefined
        ? leerId(req.query.sucursalId)
        : undefined;

    const nombre = typeof req.query.nombre === "string" ? req.query.nombre.trim() : undefined;

    const gastos = await gastoService.obtenerGastos({ sucursalId, nombre }, req.usuario);
    res.json(gastos);
};

const obtenerGastoPorId = async (req, res) => {
    const id = leerId(req.params.id);
    const gasto = await gastoService.obtenerGastoPorId(id, req.usuario);
    res.json(gasto);
};

const crearGasto = async (req, res) => {
    const gasto = await gastoService.crearGasto(req.body, req.usuario);
    res.status(201).json(gasto);
};

const modificarGasto = async (req, res) => {
    const id = leerId(req.params.id);
    const gasto = await gastoService.modificarGasto(id, req.body, req.usuario);
    res.json(gasto);
};

const eliminarGasto = async (req, res) => {
    const id = leerId(req.params.id);
    await gastoService.eliminarGasto(id, req.usuario);
    res.json({ mensaje: "Gasto eliminado" });
};

module.exports = {
    obtenerGastos,
    obtenerGastoPorId,
    crearGasto,
    modificarGasto,
    eliminarGasto
};