const prisma = require("../prisma");
const { MARGEN_RESERVA_MS } = require("../config/reservas");
const { ESTADOS_FINALES } = require("../config/estadosPedido");
const { lanzarError } = require("../config/errores");

const incluir = {
    mesa: true,
    cliente: true,
    sucursal: true,
    pago: true,
    items: { include: { producto: true } }
};

const obtenerTodos = async (sucursalId) => {
    return await prisma.pedido.findMany({
        where: { sucursalId: Number(sucursalId) },
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

const cancelarDevolviendoStock = async (id) => {
    return await prisma.$transaction(async (tx) => {
        const pedido = await tx.pedido.findUnique({
            where: { idPedido: id },
            include: { items: true }
        });

        if (!pedido) {
            lanzarError("Pedido no encontrado.", 404);
        }

        if (ESTADOS_FINALES.includes(pedido.estadoPedido)) {
            lanzarError(`El pedido ya está ${pedido.estadoPedido.toLowerCase()}.`, 409);
        }

        for (const item of pedido.items) {
            await tx.inventario.updateMany({
                where: { sucursalId: pedido.sucursalId, productoId: item.productoId },
                data: { stock: { increment: item.cantidad } }
            });
        }

        await tx.mesa.update({
            where: { idMesa: pedido.mesaId },
            data: { estado: "Libre" }
        });

        return await tx.pedido.update({
            where: { idPedido: id },
            data: { estadoPedido: "Cancelado" },
            include: incluir
        });
    });
};

module.exports = {
    obtenerTodos,
    obtenerPorId,
    crear,
    crearOcupandoMesa,
    modificar,
    eliminar,
    cancelarDevolviendoStock
};
