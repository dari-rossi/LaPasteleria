const inventarioService = require("../services/inventario.service");
const { leerId } = require("../config/errores");

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
    obtenerStockBajo, 
    create, 
    update, 
    remove };
