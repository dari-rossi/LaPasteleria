const prisma = require("../prisma");

const obtenerTodas = async () => {
    return await prisma.mesa.findMany();
};

const obtenerPorId = async (id) => {
    return await prisma.mesa.findUnique({
        where: { idMesa: id }
    });
};

const crear = async (datos) => {
    return await prisma.mesa.create({ data: datos });
};

const modificar = async (id, datos) => {
    return await prisma.mesa.update({
        where: { idMesa: id },
        data: datos
    });
};

const eliminar = async (id) => {
    return await prisma.mesa.delete({
        where: { idMesa: id }
    });
};

const obtenerTodasConReservaVigente = async (desde, hasta) => {
    return await prisma.mesa.findMany({
        orderBy: { idMesa: "asc" },
        include: {
            reservas: {
                where: {
                    fechaHoraReservada: { gte: desde, lte: hasta },
                    estadoReserva: "Activa"
                }
            }
        }
    });
};

module.exports = {
    obtenerTodas,
    obtenerPorId,
    crear,
    modificar,
    eliminar,
    obtenerTodasConReservaVigente
};