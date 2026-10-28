const prisma = require("../prisma");

// Todo lo que se devuelve junto con el pedido
const incluir = {
    mesa: true,
    cliente: true,
    sucursal: true,
    pago: true,
    items: { include: { producto: true } }
};

const obtenerTodos = async () => {
    return await prisma.pedido.findMany({
        include: incluir,
        orderBy: { idPedido: "desc" }
    });
};

const obtenerPorId = async (id) => {
    return await prisma.pedido.findUnique({
        where: { idPedido: id },
        include: incluir
    });
};

// Crea el pedido y sus items en una sola operación (si algo falla, no se guarda nada)
const crear = async (datos) => {
    return await prisma.pedido.create({
        data: datos,
        include: incluir
    });
};

const modificar = async (id, datos) => {
    return await prisma.pedido.update({
        where: { idPedido: id },
        data: datos,
        include: incluir
    });
};

const eliminar = async (id) => {
    return await prisma.pedido.delete({
        where: { idPedido: id }
    });
};

module.exports = {
    obtenerTodos,
    obtenerPorId,
    crear,
    modificar,
    eliminar
};
