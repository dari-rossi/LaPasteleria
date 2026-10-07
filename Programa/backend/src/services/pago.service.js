const pagoRepository = require("../repositories/pago.repository");

const obtenerPagos = async () => {
    return await pagoRepository.obtenerTodos();
};

const obtenerPagoPorId = async (idPedido) => {
    return await pagoRepository.obtenerPorId(idPedido);
};

const crearPago = async (datos) => {
    /* Cuando exista pedido:
    buscar el pedido
    buscar sus productos
    calcular el precio total
    buscar el tipo de cliente
    calcular el descuento
    crear el pago */

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