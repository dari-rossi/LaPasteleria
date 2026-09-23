const sucursalRepository = require("../repositories/sucursal.repository");

const obtenerSucursales = async () => {
    return await sucursalRepository.obtenerTodas();
};

const obtenerSucursalPorId = async (id) => {
    return await sucursalRepository.obtenerPorId(id);
};

const crearSucursal = async (datos) => {
    const sucursales = await sucursalRepository.obtenerTodas();

    const telefonoExiste = sucursales.some(
        (sucursal) => sucursal.telefono === datos.telefono
    );

    if (telefonoExiste) {
        const error = new Error("Ya existe una sucursal con ese teléfono.");
        error.status = 400;
        throw error;
    }

    const direccionExiste = sucursales.some(
        (sucursal) => sucursal.direccion.toLowerCase() === datos.direccion.toLowerCase()
    );

    if (direccionExiste) {
        const error = new Error("Ya existe una sucursal con esa dirección.");
        error.status = 400;
        throw error;
    }

    return await sucursalRepository.crear(datos);
};

const modificarSucursal = async (id, datos) => {
    const sucursales = await sucursalRepository.obtenerTodas();

    const telefonoExiste = sucursales.some(
        (sucursal) =>
            sucursal.id !== id &&
            sucursal.telefono === datos.telefono
    );

    if (telefonoExiste) {
        const error = new Error("Ya existe otra sucursal con ese teléfono.");
        error.status = 400;
        throw error;
    }

    const direccionExiste = sucursales.some(
        (sucursal) =>
            sucursal.id !== id &&
            sucursal.direccion.toLowerCase() === datos.direccion.toLowerCase()
    );

    if (direccionExiste) {
        const error = new Error("Ya existe otra sucursal con esa dirección.");
        error.status = 400;
        throw error;
    }

    return await sucursalRepository.modificar(id, datos);
};


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