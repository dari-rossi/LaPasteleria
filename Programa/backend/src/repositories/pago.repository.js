const prisma = require("../prisma");

const obtenerTodos = async () => {
    return await prisma.pago.findMany({
        include: {
            pedido: {
                select: {
                    sucursalId: true
                }
            }
        }
    });
};

const obtenerPorId = async (idPedido) => {
    return await prisma.pago.findUnique({
        where: { idPedido: idPedido }
    });
};

const crear = async (datos) => {
    return await prisma.pago.create({
        data: datos
    });
};

const guardarOrdenMercadoPago = async (idPedido, datos) => {
    return await prisma.pedido.update({
        where: { idPedido: idPedido },
        data: datos
    });
};

module.exports = {
    obtenerTodos,
    obtenerPorId,
    crear,
    guardarOrdenMercadoPago
};