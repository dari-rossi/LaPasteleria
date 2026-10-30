const itemProductoRepository = require("../repositories/itemProducto.repository");
const pedidoRepository = require("../repositories/pedido.repository");
const productoRepository = require("../repositories/producto.repository");
const { lanzarError } = require("../config/errores");

const redondear = (valor) => Math.round(valor * 100) / 100;
const { productoDisponibleAhora, mensajeHorario } = require("../config/horarios");

// El pedido tiene que existir y ser de la sucursal del usuario
const verificarAccesoPedido = (pedido, usuario) => {
    if (!pedido) {
        lanzarError("PEDIDO_NO_ENCONTRADO");
    }

    if (Number(pedido.sucursalId) !== Number(usuario.sucursalId)) {
        lanzarError("OTRA_SUCURSAL");
    }
};

// Busca un item o lanza 404
const buscarItem = async (id) => {
    const item = await itemProductoRepository.obtenerPorId(id);

    if (!item) {
        lanzarError("ITEM_NO_ENCONTRADO");
    }

    return item;
};

const obtenerItemProductos = async (usuario) => {
    const items = await itemProductoRepository.obtenerTodos();

    return items.filter(item =>
        Number(item.pedido.sucursalId) === Number(usuario.sucursalId)
    );
};

const obtenerItemProductosPorIdPedido = async (pedidoId, usuario) => {
    const pedido = await pedidoRepository.obtenerPorId(pedidoId);
    verificarAccesoPedido(pedido, usuario);

    return await itemProductoRepository.obtenerPorIdPedido(pedidoId);
};

const obtenerItemProductoPorId = async (id, usuario) => {
    const item = await buscarItem(id);

    const pedido = await pedidoRepository.obtenerPorId(item.pedidoId);
    verificarAccesoPedido(pedido, usuario);

    return item;
};

const crearItemProducto = async (datos, usuario) => {
    const pedido = await pedidoRepository.obtenerPorId(datos.pedidoId);
    verificarAccesoPedido(pedido, usuario);

    const producto = await productoRepository.obtenerPorId(datos.productoId);

    if (!producto) {
        lanzarError("PRODUCTO_NO_ENCONTRADO");
    }

    if (!productoDisponibleAhora(producto.tipoProducto)) {
        lanzarError(mensajeHorario(producto.tipoProducto), 409);
    }

    return await itemProductoRepository.agregar(datos.pedidoId, producto, datos.cantidad);
};

const modificarItemProducto = async (id, datos, usuario) => {
    const item = await itemProductoRepository.obtenerPorId(id);

    if (!item) {
        lanzarError("Item no encontrado.", 404);
    }

    const pedido = await pedidoRepository.obtenerPorId(item.pedidoId);
    verificarAccesoPedido(pedido, usuario);

    if (datos.cantidad > item.cantidad &&
        !productoDisponibleAhora(item.producto.tipoProducto)) {
        lanzarError(mensajeHorario(item.producto.tipoProducto), 409);
    }

    return await itemProductoRepository.cambiarCantidad(id, datos.cantidad);
};

const eliminarItemProducto = async (id, usuario) => {
    const item = await buscarItem(id);

    const pedido = await pedidoRepository.obtenerPorId(item.pedidoId);
    verificarAccesoPedido(pedido, usuario);

    return await itemProductoRepository.quitar(id);
};

module.exports = {
    obtenerItemProductos,
    obtenerItemProductosPorIdPedido,
    obtenerItemProductoPorId,
    crearItemProducto,
    modificarItemProducto,
    eliminarItemProducto
};