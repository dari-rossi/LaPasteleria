const pedidoRepository = require("../repositories/pedido.repository");
const mesaRepository = require("../repositories/mesa.repository");
const clienteRepository = require("../repositories/cliente.repository");
const sucursalRepository = require("../repositories/sucursal.repository");
const productoRepository = require("../repositories/producto.repository");
const { ESTADO_INICIAL, ESTADOS_FINALES } = require("../config/estadosPedido");

const lanzarError = (mensaje, status) => {
    const error = new Error(mensaje);
    error.status = status;
    throw error;
};

const redondear = (valor) => Math.round(valor * 100) / 100;

const verificarAccesoPedido = (pedido, usuario) => {
    if (!pedido) {
        lanzarError("Pedido no encontrado.", 404);
    }

    if (Number(pedido.sucursalId) !== Number(usuario.sucursalId)) {
        lanzarError("No tenés permiso para operar sobre pedidos de otra sucursal.", 403);
    }
};

const obtenerPedidos = async (usuario) => {
    const pedidos = await pedidoRepository.obtenerTodos();

    return pedidos.filter(pedido =>
        Number(pedido.sucursalId) === Number(usuario.sucursalId)
    );
};

const obtenerPedidoPorId = async (id, usuario) => {
    const pedido = await pedidoRepository.obtenerPorId(id);

    if (pedido) {
        verificarAccesoPedido(pedido, usuario);
    }

    return pedido;
};

const crearPedido = async (datos, usuario) => {
    if (Number(datos.sucursalId) !== Number(usuario.sucursalId)) {
        lanzarError("No tenés permiso para crear pedidos en otra sucursal.", 403);
    }

    const mesa = await mesaRepository.obtenerPorId(datos.mesaId);

    if (!mesa) {
        lanzarError("La mesa indicada no existe.", 400);
    }

    if (mesa.estado === "Ocupada") {
        lanzarError("La mesa ya está ocupada.", 409);
    }

    if (datos.comensales > mesa.maxComensales) {
        lanzarError(`La mesa admite hasta ${mesa.maxComensales} comensales.`, 400);
    }

    const cliente = await clienteRepository.obtenerPorId(datos.clienteId);

    if (!cliente) {
        lanzarError("El cliente indicado no existe.", 400);
    }

    const sucursal = await sucursalRepository.obtenerPorId(datos.sucursalId);

    if (!sucursal) {
        lanzarError("La sucursal indicada no existe.", 400);
    }

    const items = [];

    for (const item of datos.items ?? []) {
        const producto = await productoRepository.obtenerPorId(item.productoId);

        if (!producto) {
            lanzarError(`El producto ${item.productoId} no existe.`, 400);
        }

        items.push({
            productoId: item.productoId,
            cantidad: item.cantidad,
            subTotal: redondear(item.cantidad * producto.precio)
        });
    }

    const nuevoPedidoData = {
        estadoPedido: ESTADO_INICIAL,
        comensales: datos.comensales,
        mesaId: datos.mesaId,
        clienteId: datos.clienteId,
        sucursalId: datos.sucursalId
    };

    if (items.length > 0) {
        nuevoPedidoData.items = { create: items };
    }

    return await pedidoRepository.crearOcupandoMesa(nuevoPedidoData);
};

// Solo se modifican el estado y los comensales; los productos se manejan desde itemProducto.
const modificarPedido = async (id, datos, usuario) => {
    const pedido = await pedidoRepository.obtenerPorId(id);
    verificarAccesoPedido(pedido, usuario);

    if (ESTADOS_FINALES.includes(pedido.estadoPedido)) {
        lanzarError(`Un pedido ${pedido.estadoPedido.toLowerCase()} no se puede modificar.`, 409);
    }

    if (datos.estadoPedido === "Pagado") {
        lanzarError("Para pagar el pedido hay que registrar el pago.", 400);
    }

    if (datos.comensales !== undefined &&
        datos.comensales > pedido.mesa.maxComensales) {
        lanzarError(`La mesa admite hasta ${pedido.mesa.maxComensales} comensales.`, 400);
    }

    if (datos.estadoPedido === "Cancelado") {
        return await pedidoRepository.cancelarDevolviendoStock(id);
    }

    return await pedidoRepository.modificar(id, datos);
};

const eliminarPedido = async (id, usuario) => {
    const pedido = await pedidoRepository.obtenerPorId(id);
    verificarAccesoPedido(pedido, usuario);

    if (pedido.pago) {
        lanzarError("No se puede eliminar un pedido que ya tiene un pago registrado.", 409);
    }

    if (!ESTADOS_FINALES.includes(pedido.estadoPedido)) {
        await pedidoRepository.cancelarDevolviendoStock(id);
    }

    return await pedidoRepository.eliminar(id);
};

module.exports = {
    obtenerPedidos,
    obtenerPedidoPorId,
    crearPedido,
    modificarPedido,
    eliminarPedido
};