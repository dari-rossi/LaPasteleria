const mesaService = require("../services/mesa.service");

const obtenerMesas = async (req, res) => {
    try {
        const mesas = await mesaService.obtenerMesas();
        res.json(mesas);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error al obtener las mesas"});
    }
};

const obtenerMesaPorId = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if(!Number.isInteger(id) || id <= 0){
            return res.status(400).json({error: "ID incorrecto"});
        }

        const mesa = await mesaService.obtenerMesaPorId(id);

        if (!mesa) {
            return res.status(404).json({error: "Mesa no encontrada"});
        }

        res.json(mesa);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error al obtener la mesa"});
    }
};

const crearMesa = async (req, res) => {
    try {
        const mesa = await mesaService.crearMesa(req.body);
        res.status(201).json(mesa);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error al crear la mesa"});
    }
};

const modificarMesa = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if(!Number.isInteger(id) || id <= 0){
            return res.status(400).json({error: "ID incorrecto"});
        }

        const mesaExistente = await mesaService.obtenerMesaPorId(id);

        if (!mesaExistente) {
            return res.status(404).json({error: "Mesa no encontrada"});
        }

        const mesa = await mesaService.modificarMesa(id, req.body);
        res.json(mesa);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error al modificar la mesa"});
    }
};

const eliminarMesa = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if(!Number.isInteger(id) || id <= 0){
            return res.status(400).json({error: "ID incorrecto"});
        }

        const mesaExistente = await mesaService.obtenerMesaPorId(id);

        if (!mesaExistente) {
            return res.status(404).json({error: "Mesa no encontrada"});
        }

        await mesaService.eliminarMesa(id);
        res.json({mensaje: "Mesa eliminada"});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error al eliminar la mesa"});
    }
};

module.exports = {
    obtenerMesas,
    obtenerMesaPorId,
    crearMesa,
    modificarMesa,
    eliminarMesa
};