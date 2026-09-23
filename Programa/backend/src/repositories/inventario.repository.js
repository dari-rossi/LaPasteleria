const prisma = require('../prisma');

const getAll = async () => {
  return await prisma.inventario.findMany({
    include: {
      sucursal: true,
      producto: true
    }
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
    create, 
    update, 
    remove };