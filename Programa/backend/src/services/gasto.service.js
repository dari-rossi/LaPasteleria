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

const verificarAccesoGasto = (gasto, usuario) => {
    if (!gasto) {
        lanzarError("Gasto no encontrado.", 404);
    }

    if (usuario.rol === "GERENTE" &&
        Number(gasto.sucursalId) !== Number(usuario.sucursalId)) {
        lanzarError("No tenés permiso para operar sobre gastos de otra sucursal.", 403);
    }
};

const obtenerGastos = async (filtros, usuario) => {
    if (usuario.rol === "DUENIO") {
        return await gastoRepository.obtenerTodos(filtros);
    }

    if (filtros.sucursalId !== undefined &&
        Number(filtros.sucursalId) !== Number(usuario.sucursalId)) {
        lanzarError("No tenés permiso para consultar gastos de otra sucursal.", 403);
    }

    return await gastoRepository.obtenerTodos({
        ...filtros,
        sucursalId: usuario.sucursalId
    });
};

const obtenerGastoPorId = async (id, usuario) => {
    const gasto = await gastoRepository.obtenerPorId(id);
    verificarAccesoGasto(gasto, usuario);
    return gasto;
};

const crearGasto = async (datos, usuario) => {
    if (usuario.rol === "GERENTE" &&
        Number(datos.sucursalId) !== Number(usuario.sucursalId)) {
        lanzarError("No tenés permiso para crear gastos en otra sucursal.", 403);
    }

    await verificarSucursal(datos.sucursalId);
    return await gastoRepository.crear(datos);
};

const modificarGasto = async (id, datos, usuario) => {
    const gasto = await gastoRepository.obtenerPorId(id);
    verificarAccesoGasto(gasto, usuario);

    if (usuario.rol === "GERENTE" &&
        Number(datos.sucursalId) !== Number(usuario.sucursalId)) {
        lanzarError("No podés asignar un gasto a otra sucursal.", 403);
    }

    await verificarSucursal(datos.sucursalId);
    return await gastoRepository.modificar(id, datos);
};

const eliminarGasto = async (id, usuario) => {
    const gasto = await gastoRepository.obtenerPorId(id);
    verificarAccesoGasto(gasto, usuario);
    return await gastoRepository.eliminar(id);
};

module.exports = {
    obtenerGastos,
    obtenerGastoPorId,
    crearGasto,
    modificarGasto,
    eliminarGasto
};
