const inventarioRepository = require('../repositories/inventario.repository');

const obtenerInventarios = async () => {
  return await inventarioRepository.getAll();
};

const crearInventario = async (data) => {
  return await inventarioRepository.create(data);
};

const actualizarInventario = async (id, data) => {
  return await inventarioRepository.update(id, data);
};

const eliminarInventario = async (id) => {
  return await inventarioRepository.remove(id);
};

module.exports = { 
    obtenerInventarios, 
    crearInventario, 
    actualizarInventario, 
    eliminarInventario };