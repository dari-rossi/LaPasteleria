const sucursalTipoEmpleadoRepository = require("../repositories/sucursalTipoEmpleado.repository");
const sucursalRepository = require("../repositories/sucursal.repository");
const tipoEmpleadoRepository = require("../repositories/tipoEmpleado.repository");
const { esDuenio } = require("../config/tiposEmpleado");

const lanzarError = (mensaje, status) => {
    const error = new Error(mensaje);
    error.status = status;
    throw error;
};

const verificarPermisoSucursal = (sucursalId, usuario) => {
    if (!usuario) {
        lanzarError("Debés iniciar sesión", 401);
    }

    if (usuario.rol !== "DUENIO" && usuario.rol !== "GERENTE") {
        lanzarError("No tenés permiso para realizar esta operación", 403);
    }

    if (usuario.rol === "GERENTE" &&
        Number(usuario.sucursalId) !== Number(sucursalId)) {
        lanzarError("No tenés permiso para operar sobre otra sucursal", 403);
    }
};

const verificarSucursal = async (sucursalId) => {
    const sucursal = await sucursalRepository.obtenerPorId(sucursalId);

    if (!sucursal) {
        lanzarError("Sucursal no encontrada", 404);
    }
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

    if (!tipo || esDuenio(tipo.tipoEmpleado)) {
        lanzarError("Tipo de empleado no encontrado", 404);
    }

    const asignacion = await sucursalTipoEmpleadoRepository.obtenerPorId(sucursalId, datos.tipoEmpleadoId);

    if (asignacion) {
        lanzarError("Ese tipo de empleado ya está asignado a la sucursal. Modificá su cantidad.", 409);
    }

    return await sucursalTipoEmpleadoRepository.crear({
        sucursalId: sucursalId,
        tipoEmpleadoId: datos.tipoEmpleadoId,
        cantidad: datos.cantidad
    });
};

const modificarCantidad = async (sucursalId, tipoEmpleadoId, datos, usuario) => {
    verificarPermisoSucursal(sucursalId, usuario);

    const asignacion = await sucursalTipoEmpleadoRepository.obtenerPorId(sucursalId, tipoEmpleadoId);

    if (!asignacion) {
        lanzarError("Ese tipo de empleado no está asignado a la sucursal", 404);
    }

    return await sucursalTipoEmpleadoRepository.modificarCantidad(sucursalId, tipoEmpleadoId, datos.cantidad);
};

const quitarTipoEmpleado = async (sucursalId, tipoEmpleadoId, usuario) => {
    verificarPermisoSucursal(sucursalId, usuario);

    const asignacion = await sucursalTipoEmpleadoRepository.obtenerPorId(sucursalId, tipoEmpleadoId);

    if (!asignacion) {
        lanzarError("Ese tipo de empleado no está asignado a la sucursal", 404);
    }

    return await sucursalTipoEmpleadoRepository.eliminar(sucursalId, tipoEmpleadoId);
};

module.exports = {
    obtenerTiposEmpleadoDeSucursal,
    asignarTipoEmpleado,
    modificarCantidad,
    quitarTipoEmpleado
};