const itemProductoRepository = require("../repositories/itemProducto.repository");
const productoRepository = require("../repositories/producto.repository");
const { lanzarError } = require("../config/errores");
const { productoDisponibleAhora, mensajeHorario } = require("../config/horarios");

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
    const producto = await productoRepository.obtenerPorId(datos.productoId);

    if (!producto) {
        lanzarError("El producto indicado no existe.", 400);
    }

    if (!productoDisponibleAhora(producto.tipoProducto)) {
        lanzarError(mensajeHorario(producto.tipoProducto), 409);
    }

    // El pedido (existencia y estado) y el stock se validan dentro de la transacción
    return await itemProductoRepository.agregar(datos.pedidoId, producto, datos.cantidad);
};

const modificarItemProducto = async (id, datos) => {
    const item = await itemProductoRepository.obtenerPorId(id);

    // El horario solo importa si se están sumando unidades
    if (datos.cantidad > item.cantidad && !productoDisponibleAhora(item.producto.tipoProducto)) {
        lanzarError(mensajeHorario(item.producto.tipoProducto), 409);
    }

    return await itemProductoRepository.cambiarCantidad(id, datos.cantidad);
};

const eliminarItemProducto = async (id) => {
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