const sucursalTipoEmpleadoService = require("../services/sucursalTipoEmpleado.service");

const obtenerTiposEmpleadoDeSucursal = async (req, res) => {
    try {
        const sucursalId = Number(req.params.sucursalId);
        if(!Number.isInteger(sucursalId) || sucursalId <= 0){
            return res.status(400).json({error: "ID de sucursal incorrecto"});
        }

        const asignaciones = await sucursalTipoEmpleadoService.obtenerTiposEmpleadoDeSucursal(sucursalId);

        res.json(asignaciones);
    } catch (error) {
        console.error(error);

        if (error.status) {
            return res.status(error.status).json({error: error.message});
        }

        res.status(500).json({error: "Error al obtener los tipos de empleado de la sucursal"});
    }
};

const asignarTipoEmpleado = async (req, res) => {
    try {
        const sucursalId = Number(req.params.sucursalId);
        if(!Number.isInteger(sucursalId) || sucursalId <= 0){
            return res.status(400).json({error: "ID de sucursal incorrecto"});
        }

        const asignacion = await sucursalTipoEmpleadoService.asignarTipoEmpleado(sucursalId, req.body);

        res.status(201).json(asignacion);
    } catch (error) {
        console.error(error);

        if (error.status) {
            return res.status(error.status).json({error: error.message});
        }

        res.status(500).json({error: "Error al asignar el tipo de empleado a la sucursal"});
    }
};

const modificarCantidad = async (req, res) => {
    try {
        const sucursalId = Number(req.params.sucursalId);
        const tipoEmpleadoId = Number(req.params.tipoEmpleadoId);
        if(!Number.isInteger(sucursalId) || sucursalId <= 0 || !Number.isInteger(tipoEmpleadoId) || tipoEmpleadoId <= 0){
            return res.status(400).json({error: "ID incorrecto"});
        }

        const asignacion = await sucursalTipoEmpleadoService.modificarCantidad(sucursalId, tipoEmpleadoId, req.body);

        res.json(asignacion);
    } catch (error) {
        console.error(error);

        if (error.status) {
            return res.status(error.status).json({error: error.message});
        }

        res.status(500).json({error: "Error al modificar la cantidad de empleados"});
    }
};

const quitarTipoEmpleado = async (req, res) => {
    try {
        const sucursalId = Number(req.params.sucursalId);
        const tipoEmpleadoId = Number(req.params.tipoEmpleadoId);
        if(!Number.isInteger(sucursalId) || sucursalId <= 0 || !Number.isInteger(tipoEmpleadoId) || tipoEmpleadoId <= 0){
            return res.status(400).json({error: "ID incorrecto"});
        }

        await sucursalTipoEmpleadoService.quitarTipoEmpleado(sucursalId, tipoEmpleadoId);

        res.json({mensaje: "Tipo de empleado quitado de la sucursal"});
    } catch (error) {
        console.error(error);

        if (error.status) {
            return res.status(error.status).json({error: error.message});
        }

        res.status(500).json({error: "Error al quitar el tipo de empleado de la sucursal"});
    }
};

module.exports = {
    obtenerTiposEmpleadoDeSucursal,
    asignarTipoEmpleado,
    modificarCantidad,
    quitarTipoEmpleado
};
