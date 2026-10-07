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

module.exports = {
    obtenerTodas,
    obtenerPorId,
    crear,
    modificar,
    eliminar
};