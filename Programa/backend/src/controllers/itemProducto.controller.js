const itemProductoService = require("../services/itemProducto.service");
const { leerId } = require("../config/errores");

const obtenerItemProductos = async (req, res) => {
    const items = await itemProductoService.obtenerItemProductos(req.usuario);
    res.json(items);
};

const obtenerItemProductosPorIdPedido = async (req, res) => {
    const pedidoId = leerId(req.params.pedidoId);
    const items = await itemProductoService.obtenerItemProductosPorIdPedido(pedidoId, req.usuario);
    res.json(items);
};

const obtenerItemProductoPorId = async (req, res) => {
    const id = leerId(req.params.id);
    const item = await itemProductoService.obtenerItemProductoPorId(id, req.usuario);
    res.json(item);
};

// Si el producto ya está en el pedido, Prisma avisa (P2002) y se traduce a ITEM_DUPLICADO
const crearItemProducto = async (req, res) => {
    const item = await itemProductoService.crearItemProducto(req.body, req.usuario);
    res.status(201).json(item);
};

const modificarItemProducto = async (req, res) => {
    const id = leerId(req.params.id);
    const item = await itemProductoService.modificarItemProducto(id, req.body, req.usuario);
    res.json(item);
};

const eliminarItemProducto = async (req, res) => {
    const id = leerId(req.params.id);
    await itemProductoService.eliminarItemProducto(id, req.usuario);
    res.json({ mensaje: "Item eliminado" });
};

module.exports = {
    obtenerItemProductos,
    obtenerItemProductosPorIdPedido,
    obtenerItemProductoPorId,
    crearItemProducto,
    modificarItemProducto,
    eliminarItemProducto
};