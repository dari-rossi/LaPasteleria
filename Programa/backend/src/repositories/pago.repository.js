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

const crearPagando = async (datos, mesaId) => {
    const [pago] = await prisma.$transaction([
        prisma.pago.create({ data: datos }),
        prisma.pedido.update({
            where: { idPedido: datos.idPedido },
            data: { estadoPedido: "Pagado" }
        }),
        prisma.mesa.update({
            where: { idMesa: mesaId },
            data: { estado: "Libre" }
        })
    ]);

    return pago;
};

module.exports = {
    obtenerTodos,
    obtenerPorId,
    crear,
    crearPagando
};