const productoRepository = require("../repositories/producto.repository");

// Obtener todos los productos
const obtenerProductos = async (filtros) => {
    return await productoRepository.obtenerTodos(filtros);
};

// Obtener un producto por ID
const obtenerProductoPorId = async (id) => {
    return await productoRepository.obtenerPorId(id);
};

// Crear un producto
const crearProducto = async (datos) => {
    return await productoRepository.crear(datos);
};

// Modificar un producto
const modificarProducto = async (id, datos) => {
    return await productoRepository.modificar(id, datos);
};

// Eliminar un producto
const eliminarProducto = async (id) => {
    return await productoRepository.eliminar(id);
};

module.exports = {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    modificarProducto,
    eliminarProducto
};