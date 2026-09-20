const sucursalRepository = require("../repositories/sucursal.repository");

// Obtener todas las sucursales
const obtenerSucursales = async () => {
    return await sucursalRepository.obtenerTodas();
};

// Obtener una sucursal por ID
const obtenerSucursalPorId = async (id) => {
    return await sucursalRepository.obtenerPorId(id);
};

// Crear una sucursal
const crearSucursal = async (datos) => {
    return await sucursalRepository.crear(datos);
};

// Modificar una sucursal
const modificarSucursal = async (id, datos) => {
    return await sucursalRepository.modificar(id, datos);
};

// Eliminar una sucursal
const eliminarSucursal = async (id) => {
    return await sucursalRepository.eliminar(id);
};

module.exports = {
    obtenerSucursales,
    obtenerSucursalPorId,
    crearSucursal,
    modificarSucursal,
    eliminarSucursal
};