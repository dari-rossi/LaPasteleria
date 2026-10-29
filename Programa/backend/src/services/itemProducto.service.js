const itemProductoRepository = require("../repositories/itemProducto.repository");
const pedidoRepository = require("../repositories/pedido.repository");
const productoRepository = require("../repositories/producto.repository");

const lanzarError = (mensaje, status) => {
    const error = new Error(mensaje);
    error.status = status;
    throw error;
};

const redondear = (valor) => Math.round(valor * 100) / 100;

const obtenerItemProductos = async () => {
    return await itemProductoRepository.obtenerTodos();
};

const obtenerItemProductosPorIdPedido = async (pedidoId) => {
    return await itemProductoRepository.obtenerPorIdPedido(pedidoId);
};

const obtenerItemProductoPorId = async (id) => {
    return await itemProductoRepository.obtenerPorId(id);
};

const crearItemProducto = async (datos) => {
    const pedido = await pedidoRepository.obtenerPorId(datos.pedidoId);

    if (!pedido) {
        lanzarError("El pedido indicado no existe.", 400);
    }

    const producto = await productoRepository.obtenerPorId(datos.productoId);

    if (!producto) {
        lanzarError("El producto indicado no existe.", 400);
    }

    const subTotal = redondear(datos.cantidad * producto.precio);

    return await itemProductoRepository.crear({ ...datos, subTotal });
};

// Solo se puede cambiar la cantidad: el subTotal se recalcula con el precio del producto
const modificarItemProducto = async (id, datos) => {
    const itemExistente = await itemProductoRepository.obtenerPorId(id);
    const producto = await productoRepository.obtenerPorId(itemExistente.productoId);

    const subTotal = redondear(datos.cantidad * producto.precio);

    return await itemProductoRepository.modificar(id, { cantidad: datos.cantidad, subTotal });
};

const eliminarItemProducto = async (id) => {
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
