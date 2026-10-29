const prisma = require("../prisma");
const { MARGEN_RESERVA_MS } = require("../config/reservas");

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

const crearOcupandoMesa = async (datos) => {
    const ahora = new Date();
    const desde = new Date(ahora.getTime() - MARGEN_RESERVA_MS);
    const hasta = new Date(ahora.getTime() + MARGEN_RESERVA_MS);

    const [pedido] = await prisma.$transaction([
        prisma.pedido.create({ data: datos, include: incluir }),
        prisma.mesa.update({
            where: { idMesa: datos.mesaId },
            data: { estado: "Ocupada" }
        }),
        prisma.reserva.updateMany({
            where: {
                idMesa: datos.mesaId,
                estadoReserva: "Activa",
                fechaHoraReservada: { gte: desde, lte: hasta }
            },
            data: { estadoReserva: "En curso" }
        })
    ]);

    return pedido;
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
    crearOcupandoMesa,
    modificar,
    eliminar
};
