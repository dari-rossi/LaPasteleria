const inventarioService = require("../services/inventario.service");
const { leerId } = require("../config/errores");

const getAll = async (req, res) => {
    const inventarios = await inventarioService.obtenerInventarios(req.usuario);
    res.json(inventarios);
};

const create = async (req, res) => {
    const nuevoInventario = await inventarioService.crearInventario(req.body, req.usuario);
    res.status(201).json(nuevoInventario);
};

const update = async (req, res) => {
    const id = leerId(req.params.id);
    const inventarioActualizado = await inventarioService.actualizarInventario(id, req.body, req.usuario);
    res.json(inventarioActualizado);
};

const remove = async (req, res) => {
    const id = leerId(req.params.id);
    await inventarioService.eliminarInventario(id, req.usuario);
    res.status(204).send();
};

module.exports = {
    getAll,
    create,
    update,
    remove
};