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

const crearQrMercadoPago = async (req, res) => {
    try {
        const idPedido = Number(req.params.idPedido);

        if (!Number.isInteger(idPedido) || idPedido <= 0) {
            return res.status(400).json({ error: "ID de pedido incorrecto" });
        }

        const resultado = await pagoService.crearQrMercadoPago(idPedido, req.usuario);
        res.status(201).json(resultado);
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({
            error: error.status ? error.message : "Error al generar el QR"
        });
    }
};

const verificarPagoMercadoPago = async (req, res) => {
    try {
        const idPedido = Number(req.params.idPedido);

        if (!Number.isInteger(idPedido) || idPedido <= 0) {
            return res.status(400).json({ error: "ID de pedido incorrecto" });
        }

        const resultado = await pagoService.verificarPagoMercadoPago(
            idPedido,
            req.usuario
        );

        res.json(resultado);
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({
            error: error.status ? error.message : "Error al verificar el pago"
        });
    }
};

module.exports = {
    obtenerPagos,
    obtenerPagoPorId,
    crearPago,
    crearQrMercadoPago,
    verificarPagoMercadoPago
};