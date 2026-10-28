const sucursalTipoEmpleadoRepository = require("../repositories/sucursalTipoEmpleado.repository");
const sucursalRepository = require("../repositories/sucursal.repository");
const tipoEmpleadoRepository = require("../repositories/tipoEmpleado.repository");
const { esDuenio } = require("../config/tiposEmpleado");
const { lanzarError } = require("../config/errores");

const verificarPermisoSucursal = (sucursalId, usuario) => {
    if (!usuario) {
        lanzarError("SESION_REQUERIDA");
    }

    if (usuario.rol !== "DUENIO" && usuario.rol !== "GERENTE") {
        lanzarError("SIN_PERMISOS");
    }

    if (usuario.rol === "GERENTE" &&
        Number(usuario.sucursalId) !== Number(sucursalId)) {
        lanzarError("OTRA_SUCURSAL");
    }
};

const verificarSucursal = async (sucursalId) => {
    const sucursal = await sucursalRepository.obtenerPorId(sucursalId);

    if (!sucursal) {
        lanzarError("SUCURSAL_NO_ENCONTRADA");
    }
};

// Busca la asignación sucursal + tipo de empleado o lanza 404
const buscarAsignacion = async (sucursalId, tipoEmpleadoId) => {
    const asignacion = await sucursalTipoEmpleadoRepository.obtenerPorId(sucursalId, tipoEmpleadoId);

    if (!asignacion) {
        lanzarError("ASIGNACION_NO_ENCONTRADA");
    }

    return asignacion;
};

const obtenerTiposEmpleadoDeSucursal = async (sucursalId, usuario) => {
    verificarPermisoSucursal(sucursalId, usuario);
    await verificarSucursal(sucursalId);

    return await sucursalTipoEmpleadoRepository.obtenerPorSucursal(sucursalId);
};

const asignarTipoEmpleado = async (sucursalId, datos, usuario) => {
    verificarPermisoSucursal(sucursalId, usuario);
    await verificarSucursal(sucursalId);

    const tipo = await tipoEmpleadoRepository.obtenerPorId(datos.tipoEmpleadoId);

    if (!tipo || esDuenio(tipo.rol)) {
        lanzarError("TIPO_EMPLEADO_NO_ENCONTRADO");
    }

    const asignacion = await sucursalTipoEmpleadoRepository.obtenerPorId(sucursalId, datos.tipoEmpleadoId);

    if (asignacion) {
        lanzarError("ASIGNACION_DUPLICADA");
    }

    return await sucursalTipoEmpleadoRepository.crear({
        sucursalId: sucursalId,
        tipoEmpleadoId: datos.tipoEmpleadoId,
        cantidad: datos.cantidad
    });
};

const modificarCantidad = async (sucursalId, tipoEmpleadoId, datos, usuario) => {
    verificarPermisoSucursal(sucursalId, usuario);
    await buscarAsignacion(sucursalId, tipoEmpleadoId);

    return await sucursalTipoEmpleadoRepository.modificarCantidad(sucursalId, tipoEmpleadoId, datos.cantidad);
};

const quitarTipoEmpleado = async (sucursalId, tipoEmpleadoId, usuario) => {
    verificarPermisoSucursal(sucursalId, usuario);
    await buscarAsignacion(sucursalId, tipoEmpleadoId);

    return await sucursalTipoEmpleadoRepository.eliminar(sucursalId, tipoEmpleadoId);
};

module.exports = {
    obtenerTiposEmpleadoDeSucursal,
    asignarTipoEmpleado,
    modificarCantidad,
    quitarTipoEmpleado
};