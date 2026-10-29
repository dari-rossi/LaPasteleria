const pagoRepository = require("../repositories/pago.repository");
const pedidoRepository = require("../repositories/pedido.repository");
const { lanzarError } = require("../config/errores");

// El pedido tiene que existir y el usuario tiene que poder acceder a su sucursal
const verificarAccesoPedido = (pedido, usuario) => {
    if (!pedido) {
        lanzarError("PEDIDO_NO_ENCONTRADO");
    }

    if (usuario.rol !== "DUENIO" &&
        Number(pedido.sucursalId) !== Number(usuario.sucursalId)) {
        lanzarError("OTRA_SUCURSAL");
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
        lanzarError("PAGO_NO_ENCONTRADO");
    }

    return pago;
};

const crearPago = async (datos, usuario) => {
    const pedido = await pedidoRepository.obtenerPorId(datos.idPedido);

    verificarAccesoPedido(pedido, usuario);

    if (pedido.items.length === 0) {
        lanzarError("PAGO_PEDIDO_SIN_PRODUCTOS");
    }

    if (pedido.pago) {
        lanzarError("PAGO_DUPLICADO");
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