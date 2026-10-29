const pagoService = require("../services/pago.service");

const obtenerPagos = async (req, res) => {
    try {
        const pagos = await pagoService.obtenerPagos(req.usuario);
        res.json(pagos);
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({
            error: error.status ? error.message : "Error al obtener los pagos"
        });
    }
};

const obtenerPagoPorId = async (req, res) => {
    try {
        const idPedido = Number(req.params.idPedido);

        if (!Number.isInteger(idPedido) || idPedido <= 0) {
            return res.status(400).json({ error: "ID de pedido incorrecto" });
        }

        const pago = await pagoService.obtenerPagoPorId(idPedido, req.usuario);
        res.json(pago);
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({
            error: error.status ? error.message : "Error al obtener el pago"
        });
    }
};

const crearPago = async (req, res) => {
    try {
        const pago = await pagoService.crearPago(req.body, req.usuario);
        res.status(201).json(pago);
    } catch (error) {
        console.error(error);

        if (error.status) {
            return res.status(error.status).json({ error: error.message });
        }

        if (error.code === "P2002") {
            return res.status(409).json({
                error: "El pedido ya tiene un pago registrado."
            });
        }

        res.status(500).json({ error: "Error al crear el pago" });
    }
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