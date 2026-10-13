const pedidoService = require("../services/pedido.service");

const obtenerPedidos = async (req, res) => {
    try {
        const pedidos = await pedidoService.obtenerPedidos();

        res.json(pedidos);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error al obtener los pedidos"});
    }
};

const obtenerPedidoPorId = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if(!Number.isInteger(id) || id <= 0){
            return res.status(400).json({error: "ID incorrecto"});
        }

        const pedido = await pedidoService.obtenerPedidoPorId(id);

        if (!pedido) {
            return res.status(404).json({error: "Pedido no encontrado"});
        }

        res.json(pedido);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error al obtener el pedido"});
    }
};

const crearPedido = async (req, res) => {
    try {
        const pedido = await pedidoService.crearPedido(req.body);

        res.status(201).json(pedido);
    } catch (error) {
        console.error(error);

        if (error.status) {
            return res.status(error.status).json({error: error.message});
        }

        res.status(500).json({error: "Error al crear el pedido"});
    }
};

const modificarPedido = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if(!Number.isInteger(id) || id <= 0){
            return res.status(400).json({error: "ID incorrecto"});
        }

        const pedidoExistente = await pedidoService.obtenerPedidoPorId(id);

        if (!pedidoExistente) {
            return res.status(404).json({error: "Pedido no encontrado"});
        }

        const pedido = await pedidoService.modificarPedido(id, req.body);

        res.json(pedido);
    } catch (error) {
        console.error(error);

        if (error.status) {
            return res.status(error.status).json({error: error.message});
        }

        res.status(500).json({error: "Error al modificar el pedido"});
    }
};

const eliminarPedido = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if(!Number.isInteger(id) || id <= 0){
            return res.status(400).json({error: "ID incorrecto"});
        }

        const pedidoExistente = await pedidoService.obtenerPedidoPorId(id);

        if (!pedidoExistente) {
            return res.status(404).json({error: "Pedido no encontrado"});
        }

        await pedidoService.eliminarPedido(id);

        res.json({mensaje: "Pedido eliminado"});
    } catch (error) {
        console.error(error);

        if (error.status) {
            return res.status(error.status).json({error: error.message});
        }

        res.status(500).json({error: "Error al eliminar el pedido"});
    }
};

module.exports = {
    obtenerPedidos,
    obtenerPedidoPorId,
    crearPedido,
    modificarPedido,
    eliminarPedido
};
