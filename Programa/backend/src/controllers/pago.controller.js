const pagoService = require("../services/pago.service");
const { leerId } = require("../config/errores");

const obtenerPagos = async (req, res) => {
    const pagos = await pagoService.obtenerPagos(req.usuario);
    res.json(pagos);
};

const obtenerPagoPorId = async (req, res) => {
    const idPedido = leerId(req.params.idPedido);
    const pago = await pagoService.obtenerPagoPorId(idPedido, req.usuario);
    res.json(pago);
};

const crearPago = async (req, res) => {
    const pago = await pagoService.crearPago(req.body, req.usuario);
    res.status(201).json(pago);
};

module.exports = {
    obtenerPagos,
    obtenerPagoPorId,
    crearPago
};