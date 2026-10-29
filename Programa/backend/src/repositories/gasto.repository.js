const prisma = require("../prisma");

const obtenerTodos = async ({ sucursalId, nombre } = {}) => {
    const where = {};

    if (sucursalId) {
        where.sucursalId = sucursalId;
    }

    if (nombre) {
        where.nombre = { contains: nombre };
    }

    return await prisma.gasto.findMany({
        where: where,
        include: { sucursal: true },
        orderBy: { fechaGasto: "desc" }
    });
};

const obtenerPorId = async (id) => {
    return await prisma.gasto.findUnique({
        where: { id: id },
        include: { sucursal: true }
    });
};

const crear = async (datos) => {
    return await prisma.gasto.create({
        data: datos,
        include: { sucursal: true }
    });
};

const modificar = async (id, datos) => {
    return await prisma.gasto.update({
        where: { id: id },
        data: datos,
        include: { sucursal: true }
    });
};

const eliminar = async (id) => {
    return await prisma.gasto.delete({
        where: { id: id }
    });
};

module.exports = {
    obtenerTodos,
    obtenerPorId,
    crear,
    modificar,
    eliminar
};
