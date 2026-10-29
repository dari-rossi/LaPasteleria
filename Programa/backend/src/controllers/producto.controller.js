const productoService = require("../services/producto.service");
const { leerId } = require("../config/errores");

const obtenerProductos = async (req, res) => {
    const productos = await productoService.obtenerProductos();
    res.json(productos);
};

const obtenerProductoPorId = async (req, res) => {
    const id = leerId(req.params.id);
    const producto = await productoService.obtenerProductoPorId(id);
    res.json(producto);
};

const crearProducto = async (req, res) => {
    const producto = await productoService.crearProducto(req.body);
    res.status(201).json(producto);
};

const modificarProducto = async (req, res) => {
    const id = leerId(req.params.id);
    const producto = await productoService.modificarProducto(id, req.body);
    res.json(producto);
};

const eliminarProducto = async (req, res) => {
    const id = leerId(req.params.id);
    await productoService.eliminarProducto(id);
    res.json({ mensaje: "Producto eliminado" });
};

module.exports = {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    modificarProducto,
    eliminarProducto
};