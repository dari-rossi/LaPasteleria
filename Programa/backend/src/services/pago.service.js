const pagoRepository = require("../repositories/pago.repository");
const pedidoRepository = require("../repositories/pedido.repository");
const redondear = (valor) => Math.round(valor * 100) / 100;

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
    const pedido = await pedidoRepository.obtenerPorId(datos.idPedido);

    if (!pedido) {
        lanzarError("El pedido indicado no existe.", 400);
    }

    if (pedido.pago) {
        lanzarError("El pedido ya tiene un pago registrado.", 409);
    }

    if (pedido.estadoPedido === "Cancelado") {
        lanzarError("No se puede pagar un pedido cancelado.", 409);
    }

    if (pedido.items.length === 0) {
        lanzarError("No se puede registrar el pago de un pedido sin productos.", 400);
    }

    const precio = redondear(pedido.items.reduce((total, item) => total + item.subTotal, 0));
    const descuento = pedido.cliente.descuento ?? 0;
    const precioFinal = redondear(precio * (1 - descuento / 100));

    return await pagoRepository.crearPagando({
        idPedido: datos.idPedido,
        fechaHora: new Date(),
        precio,
        tipoDescuento: pedido.cliente.tipo,
        metodoPago: datos.metodoPago,
        precioFinal
    }, pedido.mesaId);
};

module.exports = {
    obtenerPagos,
    obtenerPagoPorId,
    crearPago
};