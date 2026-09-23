const inventarioService = require('../services/inventario.service');

const getAll = async (req, res) => {
  try {
    const inventarios = await inventarioService.obtenerInventarios();
    res.json(inventarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const nuevoInventario = await inventarioService.crearInventario(req.body);
    res.status(201).json(nuevoInventario);
  } catch (error) {
    res.status(400).json({ error: "Error al crear inventario. Verificá los datos o si el producto ya existe en la sucursal." });
  }
};

const update = async (req, res) => {
  try {
    const inventarioActualizado = await inventarioService.actualizarInventario(req.params.id, req.body);
    res.json(inventarioActualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    await inventarioService.eliminarInventario(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { 
    getAll, 
    create, 
    update, 
    remove };