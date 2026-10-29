const gastoRepository = require("../repositories/gasto.repository");
const sucursalRepository = require("../repositories/sucursal.repository");
const { lanzarError } = require("../config/errores");

// La sucursal indicada tiene que existir
const verificarSucursal = async (sucursalId) => {
    const sucursal = await sucursalRepository.obtenerPorId(sucursalId);

    if (!sucursal) {
        lanzarError("SUCURSAL_NO_ENCONTRADA");
    }
};

// El gasto tiene que existir y, si el usuario es gerente, ser de su sucursal
const verificarAccesoGasto = (gasto, usuario) => {
    if (!gasto) {
        lanzarError("GASTO_NO_ENCONTRADO");
    }

    if (usuario.rol === "GERENTE" &&
        Number(gasto.sucursalId) !== Number(usuario.sucursalId)) {
        lanzarError("OTRA_SUCURSAL");
    }
};

const obtenerGastos = async (filtros, usuario) => {
    if (usuario.rol === "DUENIO") {
        return await gastoRepository.obtenerTodos(filtros);
    }

    if (filtros.sucursalId !== undefined &&
        Number(filtros.sucursalId) !== Number(usuario.sucursalId)) {
        lanzarError("OTRA_SUCURSAL");
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
        lanzarError("OTRA_SUCURSAL");
    }

    await verificarSucursal(datos.sucursalId);
    return await gastoRepository.crear(datos);
};

const modificarGasto = async (id, datos, usuario) => {
    const gasto = await gastoRepository.obtenerPorId(id);
    verificarAccesoGasto(gasto, usuario);

    if (usuario.rol === "GERENTE" &&
        Number(datos.sucursalId) !== Number(usuario.sucursalId)) {
        lanzarError("OTRA_SUCURSAL");
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