const gastoRepository = require("../repositories/gasto.repository");
const sucursalRepository = require("../repositories/sucursal.repository");

const lanzarError = (mensaje, status) => {
    const error = new Error(mensaje);
    error.status = status;
    throw error;
};

const verificarSucursal = async (sucursalId) => {
    const sucursal = await sucursalRepository.obtenerPorId(sucursalId);

    if (!sucursal) {
        lanzarError("La sucursal indicada no existe.", 400);
    }
};

const obtenerGastos = async (filtros) => {
    return await gastoRepository.obtenerTodos(filtros);
};

const obtenerGastoPorId = async (id) => {
    return await gastoRepository.obtenerPorId(id);
};

const crearGasto = async (datos) => {
    await verificarSucursal(datos.sucursalId);

    return await gastoRepository.crear(datos);
};

const modificarGasto = async (id, datos) => {
    await verificarSucursal(datos.sucursalId);

    return await gastoRepository.modificar(id, datos);
};

const eliminarGasto = async (id) => {
    return await gastoRepository.eliminar(id);
};

module.exports = {
    obtenerGastos,
    obtenerGastoPorId,
    crearGasto,
    modificarGasto,
    eliminarGasto
};
