const inventarioService = require('../services/inventario.service');

const obtenerStockBajo = async (req, res) => {
    try {
        const sucursalId = req.query.sucursalId
            ? Number(req.query.sucursalId)
            : null;

        if (req.usuario.rol === "DUENIO" &&
            (!Number.isInteger(sucursalId) || sucursalId <= 0)) {
            return res.status(400).json({
                error: "Debés indicar un ID de sucursal válido"
            });
        }

        const inventarios = await inventarioService.obtenerStockBajo(
            req.usuario,
            sucursalId
        );

        res.json(inventarios);
    } catch (error) {
        res.status(error.status || 500).json({
            error: error.message
        });
    }
};

const getAll = async (req, res) => {
    try {
        const productoId = req.query.productoId
            ? Number(req.query.productoId)
            : null;

        if (productoId !== null &&
            (!Number.isInteger(productoId) || productoId <= 0)) {
            return res.status(400).json({
                error: "El ID del producto debe ser un entero positivo"
            });
        }

        const inventarios = await inventarioService.obtenerInventarios(
            req.usuario,
            productoId
        );

        res.json(inventarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const create = async (req, res) => {
  try {
    const nuevoInventario = await inventarioService.crearInventario(req.body, req.usuario);
    res.status(201).json(nuevoIventario);
  } catch (error) {
    res.status(400).json({ error: "Error al crear inventario. Verificá los datos o si el producto ya existe en la sucursal." });
  }
};

const update = async (req, res) => {
  try {
    const inventarioActualizado = await inventarioService.actualizarInventario(req.params.id, req.body, req.usuario);
    res.json(inventarioActualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    await inventarioService.eliminarInventario(req.params.id, req.usuario);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { 
    getAll,
    obtenerStockBajo, 
    create, 
    update, 
    remove };