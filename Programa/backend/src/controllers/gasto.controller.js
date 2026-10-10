const gastoService = require("../services/gasto.service");

const obtenerGastos = async (req, res) => {
    try {
        let sucursalId;

        if (req.query.sucursalId !== undefined) {
            sucursalId = Number(req.query.sucursalId);
            if(!Number.isInteger(sucursalId) || sucursalId <= 0){
                return res.status(400).json({error: "ID de sucursal incorrecto"});
            }
        }

        const nombre = typeof req.query.nombre === "string" ? req.query.nombre.trim() : undefined;

        const gastos = await gastoService.obtenerGastos({ sucursalId, nombre });

        res.json(gastos);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error al obtener los gastos"});
    }
};

const obtenerGastoPorId = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if(!Number.isInteger(id) || id <= 0){
            return res.status(400).json({error: "ID incorrecto"});
        }

        const gasto = await gastoService.obtenerGastoPorId(id);

        if (!gasto) {
            return res.status(404).json({error: "Gasto no encontrado"});
        }

        res.json(gasto);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error al obtener el gasto"});
    }
};

const crearGasto = async (req, res) => {
    try {
        const gasto = await gastoService.crearGasto(req.body);

        res.status(201).json(gasto);
    } catch (error) {
        console.error(error);

        if (error.status) {
            return res.status(error.status).json({error: error.message});
        }

        res.status(500).json({error: "Error al crear el gasto"});
    }
};

const modificarGasto = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if(!Number.isInteger(id) || id <= 0){
            return res.status(400).json({error: "ID incorrecto"});
        }

        const gastoExistente = await gastoService.obtenerGastoPorId(id);

        if (!gastoExistente) {
            return res.status(404).json({error: "Gasto no encontrado"});
        }

        const gasto = await gastoService.modificarGasto(id, req.body);

        res.json(gasto);
    } catch (error) {
        console.error(error);

        if (error.status) {
            return res.status(error.status).json({error: error.message});
        }

        res.status(500).json({error: "Error al modificar el gasto"});
    }
};

const eliminarGasto = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if(!Number.isInteger(id) || id <= 0){
            return res.status(400).json({error: "ID incorrecto"});
        }

        const gastoExistente = await gastoService.obtenerGastoPorId(id);

        if (!gastoExistente) {
            return res.status(404).json({error: "Gasto no encontrado"});
        }

        await gastoService.eliminarGasto(id);

        res.json({mensaje: "Gasto eliminado"});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error al eliminar el gasto"});
    }
};

module.exports = {
    obtenerGastos,
    obtenerGastoPorId,
    crearGasto,
    modificarGasto,
    eliminarGasto
};
