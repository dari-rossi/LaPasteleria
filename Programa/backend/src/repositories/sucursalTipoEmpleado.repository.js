const prisma = require("../prisma");

const clave = (sucursalId, tipoEmpleadoId) => ({
    sucursalId_tipoEmpleadoId: { sucursalId, tipoEmpleadoId }
});

const incluirTipoEmpleado = {
    tipoEmpleado: { select: { id: true, tipoEmpleado: true, sueldo: true } }
};

const obtenerPorSucursal = async (sucursalId) => {
    return await prisma.sucursalTipoEmpleado.findMany({
        where: { sucursalId: sucursalId },
        include: incluirTipoEmpleado
    });
};

const obtenerPorId = async (sucursalId, tipoEmpleadoId) => {
    return await prisma.sucursalTipoEmpleado.findUnique({
        where: clave(sucursalId, tipoEmpleadoId),
        include: incluirTipoEmpleado
    });
};

const crear = async (datos) => {
    return await prisma.sucursalTipoEmpleado.create({
        data: datos,
        include: incluirTipoEmpleado
    });
};

const modificarCantidad = async (sucursalId, tipoEmpleadoId, cantidad) => {
    return await prisma.sucursalTipoEmpleado.update({
        where: clave(sucursalId, tipoEmpleadoId),
        data: { cantidad: cantidad },
        include: incluirTipoEmpleado
    });
};

const eliminar = async (sucursalId, tipoEmpleadoId) => {
    return await prisma.sucursalTipoEmpleado.delete({
        where: clave(sucursalId, tipoEmpleadoId)
    });
};

module.exports = {
    obtenerPorSucursal,
    obtenerPorId,
    crear,
    modificarCantidad,
    eliminar
};
