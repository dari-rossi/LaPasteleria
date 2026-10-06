const prisma = require("../prisma");

const obtenerTodos = async () => {
    return await prisma.producto.findMany();
};

const obtenerPorId = async (id) => {
    return await prisma.producto.findUnique({
        where: { idProducto: id }
    });
};

const crear = async (datos) => {
    return await prisma.producto.create({ data: datos });
};

const modificar = async (id, datos) => {
    return await prisma.producto.update({
        where: { idProducto: id },
        data: datos
    });
};

const eliminar = async (id) => {
    return await prisma.producto.delete({
        where: { idProducto: id }
    });
};

module.exports = {
    obtenerTodos,
    obtenerPorId,
    crear,
    modificar,
    eliminar
};