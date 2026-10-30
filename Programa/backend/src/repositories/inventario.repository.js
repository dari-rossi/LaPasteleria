const prisma = require('../prisma');

const filtroPorProducto = (productoId) => {
  return productoId? {productoId: Number(productoId)}: {}
}

const getStockBajo = async (sucursalId) => {
    return await getAll(sucursalId, null, true);
};

const getAll = async (sucursalId, productoId = null, stockBajo = false) => {
    const inventarios = await prisma.inventario.findMany({
        where: {
            sucursalId: Number(sucursalId),
            ...filtroPorProducto(productoId)
        },
        include: {
            sucursal: true,
            producto: true
        }
    });

    if (!stockBajo) {
        return inventarios;
    }

    return inventarios.filter(
        inventario => inventario.stock <= inventario.producto.stockMinimo
    );
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