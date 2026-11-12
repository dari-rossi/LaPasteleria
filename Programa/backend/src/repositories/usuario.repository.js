const prisma = require("../prisma");

const seleccion = {
    idUsuario: true,
    nombreUsuario: true,
    idTipoEmpleado: true,
    sucursalId: true,
    tipoEmpleado: { select: { idTipoEmpleado: true, rol: true } },
    sucursal: { select: { id: true, direccion: true } }
};

const obtenerTodos = async (sucursalId) => {
    return await prisma.usuario.findMany({
        where: sucursalId ? { sucursalId: sucursalId } : {},
        select: seleccion,
        orderBy: { idUsuario: "asc" }
    });
};

const obtenerPorId = async (id) => {
    return await prisma.usuario.findUnique({
        where: { idUsuario: id },
        select: seleccion
    });
};

const obtenerPorNombre = async (nombreUsuario) => {
    return await prisma.usuario.findUnique({
        where: { nombreUsuario: nombreUsuario },
        include: { tipoEmpleado: true }
    });
};

const obtenerPorTipoYSucursal = async (idTipoEmpleado, sucursalId) => {
    return await prisma.usuario.findFirst({
        where: { idTipoEmpleado: idTipoEmpleado, sucursalId: sucursalId },
        select: { idUsuario: true }
    });
};

const crear = async (datos) => {
    return await prisma.usuario.create({
        data: datos,
        select: seleccion
    });
};

const modificar = async (id, datos) => {
    return await prisma.usuario.update({
        where: { idUsuario: id },
        data: datos,
        select: seleccion
    });
};

const eliminar = async (id) => {
    return await prisma.usuario.delete({
        where: { idUsuario: id },
        select: seleccion
    });
};

module.exports = {
    obtenerTodos,
    obtenerPorId,
    obtenerPorNombre,
    obtenerPorTipoYSucursal,
    crear,
    modificar,
    eliminar
};