const prisma = require("../prisma");

const obtenerTodos = async (rol) => {
    return await prisma.tipoEmpleado.findMany({
        where: rol ? { rol: rol } : {},
        include: { sucursales: { select: { sucursalId: true, cantidad: true } } },
        orderBy: { idTipoEmpleado: "asc" }
    });
};

const obtenerPorId = async (id) => {
    return await prisma.tipoEmpleado.findUnique({
        where: { idTipoEmpleado: id }
    });
};

const obtenerPorRol = async (rol) => {
    return await prisma.tipoEmpleado.findUnique({
        where: { rol: rol }
    });
};

const contarUsuarios = async (id) => {
    return await prisma.usuario.count({
        where: { idTipoEmpleado: id }
    });
};

const crear = async (datos) => {
    return await prisma.tipoEmpleado.create({ data: datos });
};

const modificar = async (id, datos) => {
    return await prisma.tipoEmpleado.update({
        where: { idTipoEmpleado: id },
        data: datos
    });
};

const eliminar = async (id) => {
    return await prisma.tipoEmpleado.delete({
        where: { idTipoEmpleado: id }
    });
};

module.exports = {
    obtenerTodos,
    obtenerPorId,
    obtenerPorRol,
    contarUsuarios,
    crear,
    modificar,
    eliminar
};