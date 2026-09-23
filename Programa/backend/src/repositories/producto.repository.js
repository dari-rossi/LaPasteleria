const prisma = require("../prisma");

const obtenerTodos = async () => {
    return await prisma.producto.findMany();
};

const obtenerPorId = async (id) => {
    return await prisma.producto.findUnique({
        where: { id: id }
    });
};

const crear = async (datos) => {
    return await prisma.producto.create({ data: datos });
};

const modificar = async (id, datos) => {
    return await prisma.producto.update({
        where: { id: id },
        data: datos
    });
};

const eliminar = async (id) => {
    return await prisma.producto.delete({
        where: { id: id }
    });
};

module.exports = {
    obtenerTodos, 
    obtenerPorId,
    crear,
    modificar,
    eliminar
};