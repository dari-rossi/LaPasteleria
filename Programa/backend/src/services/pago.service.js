const pagoRepository = require("../repositories/pago.repository");
const pedidoRepository = require("../repositories/pedido.repository");

const lanzarError = (mensaje, status) => {
    const error = new Error(mensaje);
    error.status = status;
    throw error;
};

const verificarAccesoPedido = (pedido, usuario) => {
    if (!pedido) {
        lanzarError("El pedido indicado no existe.", 404);
    }

    if (usuario.rol !== "DUENIO" &&
        Number(pedido.sucursalId) !== Number(usuario.sucursalId)) {
        lanzarError("No tenés permiso para acceder a pagos de otra sucursal.", 403);
    }
};

const obtenerPagos = async (usuario) => {
    const pagos = await pagoRepository.obtenerTodos();

    if (usuario.rol === "DUENIO") {
        return pagos;
    }

    return pagos.filter(pago =>
        Number(pago.pedido.sucursalId) === Number(usuario.sucursalId)
    );
};

const obtenerPagoPorId = async (idPedido, usuario) => {
    const pedido = await pedidoRepository.obtenerPorId(idPedido);

    verificarAccesoPedido(pedido, usuario);

    const pago = await pagoRepository.obtenerPorId(idPedido);

    if (!pago) {
        lanzarError("Pago no encontrado.", 404);
    }

    return pago;
};

const crearPago = async (datos, usuario) => {
    const pedido = await pedidoRepository.obtenerPorId(datos.idPedido);

    if (!pedido) {
        lanzarError("El pedido indicado no existe.", 400);
    }

    verificarAccesoPedido(pedido, usuario);

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