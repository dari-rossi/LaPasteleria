const prisma = require("../prisma");

const obtenerTodas = async () => {
    return await prisma.sucursal.findMany();
};

const obtenerPorId = async (id) => {
    return await prisma.sucursal.findUnique({
        where: {id: id}
    });
};

const crear = async (datos) => {
    return await prisma.sucursal.create({data: datos});
};

const modificar = async (id, datos) => {
    return await prisma.sucursal.update({
        where: {id: id},
        data: datos
    });
};

const eliminar = async (id) => {
    return await prisma.sucursal.delete({
        where: {id: id}
    });
};

module.exports = {
    obtenerTodas,
    obtenerPorId,
    crear,
    modificar,
    eliminar
};