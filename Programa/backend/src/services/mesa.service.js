const mesaRepository = require("../repositories/mesa.repository");

// Obtener todas las mesas
const obtenerMesas = async () => {
    return await mesaRepository.obtenerTodas();
};

// Obtener una mesa por ID
const obtenerMesaPorId = async (id) => {
    return await mesaRepository.obtenerPorId(id);
};

// Crear una mesa
const crearMesa = async (datos) => {
    return await mesaRepository.crear(datos);
};

// Modificar una mesa
const modificarMesa = async (id, datos) => {
    return await mesaRepository.modificar(id, datos);
};

// Eliminar una mesa
const eliminarMesa = async (id) => {
    return await mesaRepository.eliminar(id);
};

module.exports = {
    obtenerMesas,
    obtenerMesaPorId,
    crearMesa,
    modificarMesa,
    eliminarMesa
};