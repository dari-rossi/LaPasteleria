const mesaService = require("../services/mesa.service");
const { leerId } = require("../config/errores");

const obtenerMesas = async (req, res) => {
    const mesas = await mesaService.obtenerMesas();
    res.json(mesas);
};

const obtenerMesaPorId = async (req, res) => {
    const id = leerId(req.params.id);
    const mesa = await mesaService.obtenerMesaPorId(id);
    res.json(mesa);
};

const crearMesa = async (req, res) => {
    const mesa = await mesaService.crearMesa(req.body);
    res.status(201).json(mesa);
};

const modificarMesa = async (req, res) => {
    const id = leerId(req.params.id);
    const mesa = await mesaService.modificarMesa(id, req.body);
    res.json(mesa);
};

const eliminarMesa = async (req, res) => {
    const id = leerId(req.params.id);
    await mesaService.eliminarMesa(id);
    res.json({ mensaje: "Mesa eliminada" });
};

module.exports = {
    obtenerMesas,
    obtenerMesaPorId,
    crearMesa,
    modificarMesa,
    eliminarMesa
};