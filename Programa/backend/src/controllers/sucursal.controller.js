const sucursalService = require("../services/sucursal.service");
const { leerId } = require("../config/errores");

const obtenerSucursales = async (req, res) => {
    const sucursales = await sucursalService.obtenerSucursales();
    res.json(sucursales);
};

const obtenerSucursalPorId = async (req, res) => {
    const id = leerId(req.params.id);
    const sucursal = await sucursalService.obtenerSucursalPorId(id, req.usuario);
    res.json(sucursal);
};

const crearSucursal = async (req, res) => {
    const sucursal = await sucursalService.crearSucursal(req.body);
    res.status(201).json(sucursal);
};

const modificarSucursal = async (req, res) => {
    const id = leerId(req.params.id);
    const sucursal = await sucursalService.modificarSucursal(id, req.body);
    res.json(sucursal);
};

const eliminarSucursal = async (req, res) => {
    const id = leerId(req.params.id);
    await sucursalService.eliminarSucursal(id);
    res.json({ mensaje: "Sucursal eliminada" });
};

module.exports = {
    obtenerSucursales,
    obtenerSucursalPorId,
    crearSucursal,
    modificarSucursal,
    eliminarSucursal
};