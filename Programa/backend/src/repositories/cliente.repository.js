const prisma = require("../prisma");

const obtenerTodos = async () => {
    return await prisma.cliente.findMany({
        orderBy: { tipo: "asc" }
    });
};

const obtenerPorId = async (id) => {
    return await prisma.cliente.findUnique({
        where: { id }
    });
};

const obtenerPorTipo = async (tipo) => {
    return await prisma.cliente.findUnique({
        where: { tipo }
    });
};

const crear = async (datos) => {
    return await prisma.cliente.create({
        data: datos
    });
};

const modificar = async (id, datos) => {
    return await prisma.cliente.update({
        where: { id },
        data: datos
    });
};

const eliminar = async (id) => {
    return await prisma.cliente.delete({
        where: { id }
    });
};

module.exports = {
    obtenerTodos,
    obtenerPorId,
    obtenerPorTipo,
    crear,
    modificar,
    eliminar
};