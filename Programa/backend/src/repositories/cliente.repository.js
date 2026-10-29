const prisma = require("../prisma");

const obtenerTodos = async () => {
    return await prisma.cliente.findMany();
};

const obtenerPorId = async (id) => {
    return await prisma.cliente.findUnique({
        where: {id: id}
    });
};

const crear = async (datos) => {
    return await prisma.cliente.create({data: datos});
};

const modificar = async (id, datos) => {
    return await prisma.cliente.update({
        where: {id: id},
        data: datos
    });
};

const eliminar = async (id) => {
    return await prisma.cliente.delete({
        where: {id: id}
    });
};

module.exports = {
    obtenerTodos,
    obtenerPorId,
    crear,
    modificar,
    eliminar
};