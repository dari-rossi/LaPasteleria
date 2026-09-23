const productoService = require("../services/producto.service");

const obtenerProductos = async (req, res) => {
    try {
        const productos = await productoService.obtenerProductos();
        res.json(productos);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error al obtener los productos"});
    }
};

const obtenerProductoPorId = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if(!Number.isInteger(id) || id <= 0){
            return res.status(400).json({error: "ID incorrecto"});
        }

        const producto = await productoService.obtenerProductoPorId(id);

        if (!producto) {
            return res.status(404).json({error: "Producto no encontrado"});
        }

        res.json(producto);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error al obtener el producto"});
    }
};

const crearProducto = async (req, res) => {
    try {
        const producto = await productoService.crearProducto(req.body);
        res.status(201).json(producto);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error al crear el producto"});
    }
};

const modificarProducto = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if(!Number.isInteger(id) || id <= 0){
            return res.status(400).json({error: "ID incorrecto"});
        }

        const productoExistente = await productoService.obtenerProductoPorId(id);

        if (!productoExistente) {
            return res.status(404).json({error: "Producto no encontrado"});
        }

        const producto = await productoService.modificarProducto(id, req.body);
        res.json(producto);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error al modificar el producto"});
    }
};

const eliminarProducto = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if(!Number.isInteger(id) || id <= 0){
            return res.status(400).json({error: "ID incorrecto"});
        }

        const productoExistente = await productoService.obtenerProductoPorId(id);

        if (!productoExistente) {
            return res.status(404).json({error: "Producto no encontrado"});
        }

        await productoService.eliminarProducto(id);
        res.json({mensaje: "Producto eliminado"});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error al eliminar el producto"});
    }
};

module.exports = {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    modificarProducto,
    eliminarProducto
};