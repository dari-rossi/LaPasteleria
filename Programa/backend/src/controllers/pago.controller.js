const pagoService = require("../services/pago.service");

const obtenerPagos = async (req, res) => {
    try {
        const pagos = await pagoService.obtenerPagos();

        res.json(pagos);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error al obtener los pagos"});
    }
};

const obtenerPagoPorId = async (req, res) => {
    try {
        const idPedido = Number(req.params.idPedido);

        if(!Number.isInteger(idPedido) || idPedido <= 0){
            return res.status(400).json({error: "ID de pedido incorrecto"});
        }

        const pago = await pagoService.obtenerPagoPorId(idPedido);

        if (!pago) {return res.status(404).json({error: "Pago no encontrado"});}

        res.json(pago);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error al obtener el pago"});
    }
};

const crearPago = async (req, res) => {
    try {
        const pago = await pagoService.crearPago(req.body);
        res.status(201).json(pago);
    } catch (error) {
        console.error(error);
        if (error.status) {return res.status(error.status).json({error: error.message});}

        res.status(500).json({error: "Error al crear el pago"});
    }
};

module.exports = {
    obtenerPagos,
    obtenerPagoPorId,
    crearPago
};