const mesaService = require("../services/mesa.service");
const { leerId } = require("../config/errores");

const obtenerMesas = async (req, res) => {
    const mesas = await mesaService.obtenerMesas(req.usuario, req.query.sucursalId);
    res.json(mesas);
};

const obtenerMesaPorId = async (req, res) => {
    const id = leerId(req.params.id);
    res.json(await mesaService.obtenerMesaPorId(id, req.usuario));
};

const crearMesa = async (req, res) => {
    const mesa = await mesaService.crearMesa(req.body, req.usuario, req.query.sucursalId);
    res.status(201).json(mesa);
};

const modificarMesa = async (req, res) => {
    const id = leerId(req.params.id);
    res.json(await mesaService.modificarMesa(id, req.body, req.usuario));
};

const eliminarMesa = async (req, res) => {
    const id = leerId(req.params.id);
    await mesaService.eliminarMesa(id, req.usuario);
    res.json({ mensaje: "Mesa eliminada" });
};

module.exports = {
    obtenerMesas,
    obtenerMesaPorId,
    crearMesa,
    modificarMesa,
    eliminarMesa
};