const sucursalService = require("../services/sucursal.service");

const obtenerSucursales = async (req, res) => {
    try {
        const sucursales = await sucursalService.obtenerSucursales();

        res.json(sucursales);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error al obtener las sucursales"});
    }
};

const obtenerSucursalPorId = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if(!Number.isInteger(id) || id <= 0){
            return res.status(400).json({error: "ID incorrecto"});
        }

        const sucursal = await sucursalService.obtenerSucursalPorId(id);

        if (!sucursal) {
            return res.status(404).json({error: "Sucursal no encontrada"});
        }

        res.json(sucursal);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error al obtener la sucursal"});
    }
};

const crearSucursal = async (req, res) => {
    try {
        const sucursal = await sucursalService.crearSucursal(req.body);

        res.status(201).json(sucursal);
    } catch (error) {
        console.error(error);

        if (error.status) {
            return res.status(error.status).json({error: error.message});
        }

        res.status(500).json({error: "Error al crear la sucursal"});
    }
};

const modificarSucursal = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if(!Number.isInteger(id) || id <= 0){
            return res.status(400).json({error: "ID incorrecto"});
        }

        const sucursalExistente = await sucursalService.obtenerSucursalPorId(id);

        if (!sucursalExistente) {
            return res.status(404).json({error: "Sucursal no encontrada"});
        }

        const sucursal = await sucursalService.modificarSucursal(id,req.body);

        res.json(sucursal);
    } catch (error) {
        console.error(error);

        if (error.status) {
            return res.status(error.status).json({error: error.message});
        }

        res.status(500).json({error: "Error al modificar la sucursal"});
    }
};

const eliminarSucursal = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if(!Number.isInteger(id) || id <= 0){
            return res.status(400).json({error: "ID incorrecto"});
        }

        const sucursalExistente = await sucursalService.obtenerSucursalPorId(id);

        if (!sucursalExistente) {
            return res.status(404).json({error: "Sucursal no encontrada"});
        }

        await sucursalService.eliminarSucursal(id);

        res.json({mensaje: "Sucursal eliminada"});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error al eliminar la sucursal"});
    }
};

module.exports = {
    obtenerSucursales,
    obtenerSucursalPorId,
    crearSucursal,
    modificarSucursal,
    eliminarSucursal
};