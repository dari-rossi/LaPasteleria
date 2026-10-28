const itemProductoService = require("../services/itemProducto.service");

const obtenerItemProductos = async (req, res) => {
    try {
        const items = await itemProductoService.obtenerItemProductos(req.usuario);

        res.json(items);
    } catch (error) {
        console.error(error);
        if (error.status) {
            return res.status(error.status).json({error: error.message});
        }
        res.status(500).json({error: "Error al obtener los items"});
    }
};

const obtenerItemProductosPorIdPedido = async (req, res) => {
    try {
        const pedidoId = Number(req.params.pedidoId);
        if(!Number.isInteger(pedidoId) || pedidoId <= 0){
            return res.status(400).json({error: "ID de pedido incorrecto"});
        }

        const items = await itemProductoService.obtenerItemProductosPorIdPedido(pedidoId, req.usuario);

        res.json(items);
    } catch (error) {
        console.error(error);
        if (error.status) {
            return res.status(error.status).json({error: error.message});
        }
        res.status(500).json({error: "Error al obtener el item"});
    }
};
const obtenerItemProductoPorId = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if(!Number.isInteger(id) || id <= 0){
            return res.status(400).json({error: "ID incorrecto"});
        }

        const item = await itemProductoService.obtenerItemProductoPorId(id, req.usuario);

        if (!item) {
            return res.status(404).json({error: "Item no encontrado"});
        }

        res.json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error al obtener el item"});
    }
};

const crearItemProducto = async (req, res) => {
    try {
        const item = await itemProductoService.crearItemProducto(req.body, req.usuario);

        res.status(201).json(item);
    } catch (error) {
        console.error(error);

        if (error.status) {
            return res.status(error.status).json({error: error.message});
        }

        // P2002: ese producto ya está cargado en el pedido (clave única pedidoId + productoId)
        if (error.code === "P2002") {
            return res.status(409).json({error: "Ese producto ya está cargado en el pedido"});
        }

        res.status(500).json({error: "Error al crear el item"});
    }
};

const modificarItemProducto = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if(!Number.isInteger(id) || id <= 0){
            return res.status(400).json({error: "ID incorrecto"});
        }

        const itemExistente = await itemProductoService.obtenerItemProductoPorId(id);

        if (!itemExistente) {
            return res.status(404).json({error: "Item no encontrado"});
        }

        const item = await itemProductoService.modificarItemProducto(id, req.body, req.usuario);

        res.json(item);
    } catch (error) {
        console.error(error);

        if (error.status) {
            return res.status(error.status).json({error: error.message});
        }

        res.status(500).json({error: "Error al modificar el item"});
    }
};

const eliminarItemProducto = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if(!Number.isInteger(id) || id <= 0){
            return res.status(400).json({error: "ID incorrecto"});
        }

        const itemExistente = await itemProductoService.obtenerItemProductoPorId(id);

        if (!itemExistente) {
            return res.status(404).json({error: "Item no encontrado"});
        }

        await itemProductoService.eliminarItemProducto(id, req.usuario);

        res.json({mensaje: "Item eliminado"});
    } catch (error) {
        console.error(error);

        if (error.status) {
            return res.status(error.status).json({error: error.message});
        }

        res.status(500).json({error: "Error al eliminar el item"});
    }
};

module.exports = {
    obtenerItemProductos,
    obtenerItemProductosPorIdPedido,
    obtenerItemProductoPorId,
    crearItemProducto,
    modificarItemProducto,
    eliminarItemProducto
};
