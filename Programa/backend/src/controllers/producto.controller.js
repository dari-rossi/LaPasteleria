const productoService = require("../services/producto.service");
const { leerId } = require("../config/errores");

const obtenerProductos = async (req, res) => {
    const productos = await productoService.obtenerProductos();
    res.json(productos);
    try {
        const { tipoProducto, nombre, popularidad } = req.query;
        const sucursalId = req.query.sucursalId
            ? Number(req.query.sucursalId)
            : null;

        if (sucursalId !== null &&
            (!Number.isInteger(sucursalId) || sucursalId <= 0)) {
            return res.status(400).json({
                error: "El ID de sucursal debe ser un entero positivo"
            });
        }

        if (popularidad && popularidad !== "desc") {
            return res.status(400).json({
                error: "La popularidad permitida es desc"
            });
        }

        if (popularidad === "desc" && sucursalId === null) {
            return res.status(400).json({
                error: "Debés indicar una sucursal para ordenar por popularidad"
            });
        }

        const productos = await productoService.obtenerProductos({
            tipoProducto,
            nombre,
            sucursalId,
            popularidad
        });

        res.json(productos);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al obtener los productos"
        });
    }
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