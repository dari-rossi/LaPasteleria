const prisma = require("../prisma");

const obtenerTodos = async () => {
    return await prisma.pago.findMany();
};

const obtenerPorId = async (idPedido) => {
    return await prisma.pago.findUnique({where: {idPedido: idPedido}});
};

const crear = async (datos) => {
    return await prisma.pago.create({data: datos});
};

module.exports = {
    obtenerTodos,
    obtenerPorId,
    crear
};