const prisma = require('../prisma');

const getAll = async (sucursalId = null) => {
  return await prisma.inventario.findMany({
    where: sucursalId === null ? {} : { sucursalId },
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
  create,
  update,
  remove
};