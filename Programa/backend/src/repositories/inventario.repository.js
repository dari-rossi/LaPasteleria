const prisma = require('../prisma');

const filtroPorProducto = (productoId) => {
  return productoId? {productoId: Number(productoId)}: {}
}

const getStockBajo = async (sucursalId) => {
    const inventarios = await getAll(sucursalId);

    return inventarios.filter(
        inventario => inventario.stock <= inventario.stockMin
    );
};

const getAll = async (sucursalId = null, productoId = null) => {
    return await prisma.inventario.findMany({
        where: {
            ...filtroPorProducto(productoId),
            ...(sucursalId !== null
                ? { sucursalId: Number(sucursalId) }
                : {})
        },
        include: {
            sucursal: true,
            producto: true
        }
    });
};
const getById = async (id) => {
  return await prisma.inventario.findUnique({
    where: { id: parseInt(id) }
  });
};

const create = async (data) => {
  return await prisma.inventario.create({
    data
  });
};

const update = async (id, data) => {
  return await prisma.inventario.update({
    where: { id: parseInt(id) },
    data
  });
};

const remove = async (id) => {
  return await prisma.inventario.delete({
    where: { id: parseInt(id) }
  });
};

module.exports = {
    getAll,
    getById,
    getStockBajo,
    create,
    update,
    remove
};