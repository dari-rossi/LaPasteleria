const sucursalRepository = require("../repositories/sucursal.repository");
const { lanzarError } = require("../config/errores");

// Busca una sucursal o lanza 404
const buscarSucursal = async (id) => {
    const sucursal = await sucursalRepository.obtenerPorId(id);

    if (!sucursal) {
        lanzarError("SUCURSAL_NO_ENCONTRADA");
    }

    return sucursal;
};

// idActual: id de la sucursal que se está modificando (para no chocar consigo misma)
const verificarDuplicados = async (datos, idActual) => {
    const sucursales = await sucursalRepository.obtenerTodas();
    const otras = sucursales.filter((sucursal) => sucursal.id !== idActual);

    if (otras.some((sucursal) => sucursal.telefono === datos.telefono)) {
        lanzarError("SUCURSAL_TELEFONO_DUPLICADO");
    }

    if (otras.some((sucursal) => sucursal.direccion.toLowerCase() === datos.direccion.toLowerCase())) {
        lanzarError("SUCURSAL_DIRECCION_DUPLICADA");
    }
};

const obtenerSucursales = async () => {
    return await sucursalRepository.obtenerTodas();
};

const obtenerSucursalPorId = async (id) => {
    return await buscarSucursal(id);
};

const crearSucursal = async (datos) => {
    await verificarDuplicados(datos);

    return await sucursalRepository.crear(datos);
};

const modificarSucursal = async (id, datos) => {
    await buscarSucursal(id);
    await verificarDuplicados(datos, id);

    return await sucursalRepository.modificar(id, datos);
};

const eliminarSucursal = async (id) => {
    await buscarSucursal(id);

    return await sucursalRepository.eliminar(id);
};

module.exports = {
    obtenerSucursales,
    obtenerSucursalPorId,
    crearSucursal,
    modificarSucursal,
    eliminarSucursal
};