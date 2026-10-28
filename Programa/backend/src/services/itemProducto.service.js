const itemProductoRepository = require("../repositories/itemProducto.repository");
const pedidoRepository = require("../repositories/pedido.repository");
const productoRepository = require("../repositories/producto.repository");

const lanzarError = (mensaje, status) => {
    const error = new Error(mensaje);
    error.status = status;
    throw error;
};

const redondear = (valor) => Math.round(valor * 100) / 100;

const verificarAccesoPedido = (pedido, usuario) => {
    if (!pedido) {
        lanzarError("El pedido indicado no existe.", 404);
    }

    if (Number(pedido.sucursalId) !== Number(usuario.sucursalId)) {
        lanzarError("No tenés permiso para operar sobre pedidos de otra sucursal.", 403);
    }
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
    const item = await itemProductoRepository.obtenerPorId(id);

    if (!item) {
        return null;
    }

    const pedido = await pedidoRepository.obtenerPorId(item.pedidoId);
    verificarAccesoPedido(pedido, usuario);

    return item;
};

const crearItemProducto = async (datos, usuario) => {
    const pedido = await pedidoRepository.obtenerPorId(datos.pedidoId);
    verificarAccesoPedido(pedido, usuario);

    const producto = await productoRepository.obtenerPorId(datos.productoId);

    if (!producto) {
        lanzarError("El producto indicado no existe.", 400);
    }

    const subTotal = redondear(datos.cantidad * producto.precio);

    return await itemProductoRepository.crear({ ...datos, subTotal });
};

const modificarItemProducto = async (id, datos, usuario) => {
    const itemExistente = await itemProductoRepository.obtenerPorId(id);

    if (!itemExistente) {
        lanzarError("Item no encontrado.", 404);
    }

    const pedido = await pedidoRepository.obtenerPorId(itemExistente.pedidoId);
    verificarAccesoPedido(pedido, usuario);

    const producto = await productoRepository.obtenerPorId(itemExistente.productoId);
    const subTotal = redondear(datos.cantidad * producto.precio);

    return await itemProductoRepository.modificar(id, {
        cantidad: datos.cantidad,
        subTotal
    });
};

const eliminarItemProducto = async (id, usuario) => {
    const item = await itemProductoRepository.obtenerPorId(id);

    if (!item) {
        lanzarError("Item no encontrado.", 404);
    }

    const pedido = await pedidoRepository.obtenerPorId(item.pedidoId);
    verificarAccesoPedido(pedido, usuario);

    return await itemProductoRepository.eliminar(id);
};

module.exports = {
    obtenerItemProductos,
    obtenerItemProductosPorIdPedido,
    obtenerItemProductoPorId,
    crearItemProducto,
    modificarItemProducto,
    eliminarItemProducto
};