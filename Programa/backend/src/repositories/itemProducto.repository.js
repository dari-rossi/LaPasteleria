const prisma = require("../prisma");

const obtenerTodos = async () => {
    return await prisma.itemProducto.findMany({
        include: { pedido: true, producto: true }
    });
};

const obtenerPorIdPedido = async (pedidoId) => {
    return await prisma.itemProducto.findMany({
        where: { pedidoId: pedidoId },
        include: { producto: true }
    });
};

const obtenerPorId = async (id) => {
    return await prisma.itemProducto.findUnique({
        where: { idItemProducto: id },
        include: { producto: true }
    });
};

const crear = async (datos) => {
    return await prisma.itemProducto.create({
        data: datos,
        include: { producto: true }
    });
};

const modificar = async (id, datos) => {
    return await prisma.itemProducto.update({
        where: { idItemProducto: id },
        data: datos,
        include: { producto: true }
    });
};

const eliminar = async (id) => {
    return await prisma.itemProducto.delete({
        where: { idItemProducto: id }
    });
};

module.exports = {
    obtenerTodos,
    obtenerPorIdPedido,
    obtenerPorId,
    crear,
    modificar,
    eliminar
};
