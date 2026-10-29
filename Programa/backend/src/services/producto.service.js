const productoRepository = require("../repositories/producto.repository");
const { lanzarError } = require("../config/errores");

// Busca un producto o lanza 404
const buscarProducto = async (id) => {
    const producto = await productoRepository.obtenerPorId(id);

    if (!producto) {
        lanzarError("PRODUCTO_NO_ENCONTRADO");
    }

    return producto;
};

// Obtener todos los productos
const obtenerProductos = async (filtros) => {
    return await productoRepository.obtenerTodos(filtros);
};

const obtenerProductoPorId = async (id) => {
    return await buscarProducto(id);
};

const crearProducto = async (datos) => {
    return await productoRepository.crear(datos);
};

const modificarProducto = async (id, datos) => {
    await buscarProducto(id);

    return await productoRepository.modificar(id, datos);
};

const eliminarProducto = async (id) => {
    await buscarProducto(id);

    return await productoRepository.eliminar(id);
};

module.exports = {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    modificarProducto,
    eliminarProducto
};