const pagoRepository = require("../repositories/pago.repository");
const pedidoRepository = require("../repositories/pedido.repository");

const lanzarError = (mensaje, status) => {
    const error = new Error(mensaje);
    error.status = status;
    throw error;
};

const obtenerPagos = async () => {
    return await pagoRepository.obtenerTodos();
};

const obtenerPagoPorId = async (idPedido) => {
    return await pagoRepository.obtenerPorId(idPedido);
};

const crearPago = async (datos) => {
    /* Todavía falta:
    calcular el precio total
    buscar el tipo de cliente
    calcular el descuento */

    const pedido = await pedidoRepository.obtenerPorId(datos.idPedido);

    if (!pedido) {
        lanzarError("El pedido indicado no existe.", 400);
    }

    // Un pedido sin productos es un pedido incompleto: no se puede pagar
    if (pedido.items.length === 0) {
        lanzarError("No se puede registrar el pago de un pedido sin productos.", 400);
    }

    if (pedido.pago) {
        lanzarError("El pedido ya tiene un pago registrado.", 409);
    }

    const nuevoPagoData = {
        idPedido: datos.idPedido,
        fechaHora: new Date(),
        precio: 0,
        tipoDescuento: "General",
        metodoPago: datos.metodoPago,
        precioFinal: 0
    };

    return await pagoRepository.crear(nuevoPagoData);
};

module.exports = {
    obtenerPagos,
    obtenerPagoPorId,
    crearPago
};