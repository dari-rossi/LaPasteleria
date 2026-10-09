const prisma = require("../prisma");

const obtenerTodos = async () => {
    return await prisma.reserva.findMany();
};

const obtenerPorId = async (idMesa, fechaHora) => {
    return await prisma.reserva.findUnique({
        where: {
            idMesa_fechaHoraReservada: {
                idMesa,
                fechaHoraReservada: fechaHora
            }
        }
    });
};

const crear = async (datos) => {
    return await prisma.reserva.create({ data: datos });
};

const modificar = async (idMesa, fechaHora, datos) => {
    return await prisma.reserva.update({
        where: {
            idMesa_fechaHoraReservada: {
                idMesa,
                fechaHoraReservada: fechaHora
            }
        },
        data: datos
    });
};

const eliminar = async (idMesa, fechaHora) => {
    return await prisma.reserva.delete({
        where: {
            idMesa_fechaHoraReservada: {
                idMesa,
                fechaHoraReservada: fechaHora
            }
        }
    });
};

module.exports = {
    obtenerTodos,
    obtenerPorId,
    crear,
    modificar,
    eliminar
};