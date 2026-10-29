const pedidoService = require("../services/pedido.service");
const { leerId } = require("../config/errores");

const obtenerPedidos = async (req, res) => {
    const pedidos = await pedidoService.obtenerPedidos(req.usuario);
    res.json(pedidos);
};

const obtenerPedidoPorId = async (req, res) => {
    const id = leerId(req.params.id);
    const pedido = await pedidoService.obtenerPedidoPorId(id, req.usuario);
    res.json(pedido);
};

const crearPedido = async (req, res) => {
    const pedido = await pedidoService.crearPedido(req.body, req.usuario);
    res.status(201).json(pedido);
};

const modificarPedido = async (req, res) => {
    const id = leerId(req.params.id);
    const pedido = await pedidoService.modificarPedido(id, req.body, req.usuario);
    res.json(pedido);
};

const eliminarPedido = async (req, res) => {
    const id = leerId(req.params.id);
    await pedidoService.eliminarPedido(id, req.usuario);
    res.json({ mensaje: "Pedido eliminado" });
};

module.exports = {
    obtenerPedidos,
    obtenerPedidoPorId,
    crearPedido,
    modificarPedido,
    eliminarPedido
};