const tipoEmpleadoService = require("../services/tipoEmpleado.service");

const obtenerTiposEmpleado = async (req, res) => {
    try {
        const tipoEmpleado = req.query.tipoEmpleado;
        const tipos = await tipoEmpleadoService.obtenerTiposEmpleado(tipoEmpleado);

        res.json(tipos);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error al obtener los tipos de empleado"});
    }
};

const obtenerTipoEmpleadoPorId = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if(!Number.isInteger(id) || id <= 0){
            return res.status(400).json({error: "ID incorrecto"});
        }

        const tipo = await tipoEmpleadoService.obtenerTipoEmpleadoPorId(id);

        if (!tipo) {
            return res.status(404).json({error: "Tipo de empleado no encontrado"});
        }

        res.json(tipo);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error al obtener el tipo de empleado"});
    }
};

const crearTipoEmpleado = async (req, res) => {
    try {
        const tipo = await tipoEmpleadoService.crearTipoEmpleado(req.body);

        res.status(201).json(tipo);
    } catch (error) {
        console.error(error);

        if (error.status) {
            return res.status(error.status).json({error: error.message});
        }

        res.status(500).json({error: "Error al crear el tipo de empleado"});
    }
};

const modificarTipoEmpleado = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if(!Number.isInteger(id) || id <= 0){
            return res.status(400).json({error: "ID incorrecto"});
        }

        const tipoExistente = await tipoEmpleadoService.obtenerTipoEmpleadoPorId(id);

        if (!tipoExistente) {
            return res.status(404).json({error: "Tipo de empleado no encontrado"});
        }

        const tipo = await tipoEmpleadoService.modificarTipoEmpleado(id, req.body);

        res.json(tipo);
    } catch (error) {
        console.error(error);

        if (error.status) {
            return res.status(error.status).json({error: error.message});
        }

        res.status(500).json({error: "Error al modificar el tipo de empleado"});
    }
};

const eliminarTipoEmpleado = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if(!Number.isInteger(id) || id <= 0){
            return res.status(400).json({error: "ID incorrecto"});
        }

        const tipoExistente = await tipoEmpleadoService.obtenerTipoEmpleadoPorId(id);

        if (!tipoExistente) {
            return res.status(404).json({error: "Tipo de empleado no encontrado"});
        }

        await tipoEmpleadoService.eliminarTipoEmpleado(id);

        res.json({mensaje: "Tipo de empleado eliminado"});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error al eliminar el tipo de empleado"});
    }
};

module.exports = {
    obtenerTiposEmpleado,
    obtenerTipoEmpleadoPorId,
    crearTipoEmpleado,
    modificarTipoEmpleado,
    eliminarTipoEmpleado
};
