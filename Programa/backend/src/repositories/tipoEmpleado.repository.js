const prisma = require("../prisma");

const filtroPorTipo = (tipoEmpleado) => {
    return tipoEmpleado ? { tipoEmpleado: { contains: tipoEmpleado } } : {};
};

const obtenerTodos = async (tipoEmpleado) => {
    return await prisma.tipoEmpleado.findMany({
        where: filtroPorTipo(tipoEmpleado),
        include: { sucursales: { select: { cantidad: true } } },
        orderBy: { tipoEmpleado: "asc" }
    });
};

const obtenerPorId = async (id) => {
    return await prisma.tipoEmpleado.findUnique({
        where: { id: id }
    });
};

const obtenerPorUsuario = async (usuario) => {
    return await prisma.tipoEmpleado.findUnique({
        where: { usuario: usuario }
    });
};

const obtenerPorNombre = async (tipoEmpleado) => {
    return await prisma.tipoEmpleado.findUnique({
        where: { tipoEmpleado: tipoEmpleado }
    });
};

const crear = async (datos) => {
    return await prisma.tipoEmpleado.create({ data: datos });
};

const modificar = async (id, datos) => {
    return await prisma.tipoEmpleado.update({
        where: { id: id },
        data: datos
    });
};

const eliminar = async (id) => {
    return await prisma.tipoEmpleado.delete({
        where: { id: id }
    });
};

module.exports = {
    obtenerTodos,
    obtenerPorId,
    obtenerPorUsuario,
    obtenerPorNombre,
    crear,
    modificar,
    eliminar
};
