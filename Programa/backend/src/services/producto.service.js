const productoRepository = require("../repositories/producto.repository");

// Obtener todos los productos
const obtenerProductos = async () => {
    return await productoRepository.obtenerTodos();
};

// Obtener un producto por ID
const obtenerProductoPorId = async (id) => {
    return await productoRepository.obtenerPorId(id);
};

// Crear un producto (dejo un espacio por si más adelante fuese necesario calcular acá lo de precioFinal)
const crearProducto = async (datos) => {

    return await productoRepository.crear(datos);
};

// Modificar un producto (dejo un espacio por si más adelante fuese necesario recalcular acá lo de precioFinal en base al nuevo precio)
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