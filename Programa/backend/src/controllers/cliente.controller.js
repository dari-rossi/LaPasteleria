const clienteService = require("../services/cliente.service");

const obtenerClientes = async (req, res) => {
    try {
        const clientes = await clienteService.obtenerClientes();

        res.json(clientes);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error al obtener los clientes"});
    }
};

const obtenerClientePorId = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if(!Number.isInteger(id) || id <= 0){
            return res.status(400).json({error: "ID incorrecto"});
        }

        const cliente = await clienteService.obtenerClientePorId(id);

        if (!cliente) {
            return res.status(404).json({error: "Cliente no encontrado"});
        }

        res.json(cliente);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error al obtener el cliente"});
    }
};

const crearCliente = async (req, res) => {
    try {
        const cliente = await clienteService.crearCliente(req.body);

        res.status(201).json(cliente);
    } catch (error) {
        console.error(error);

        if (error.status) {
            return res.status(error.status).json({error: error.message});
        }

        res.status(500).json({error: "Error al crear el cliente"});
    }
};

const modificarCliente = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if(!Number.isInteger(id) || id <= 0){
            return res.status(400).json({error: "ID incorrecto"});
        }

        const clienteExistente = await clienteService.obtenerClientePorId(id);

        if (!clienteExistente) {
            return res.status(404).json({error: "Cliente no encontrado"});
        }

        const cliente = await clienteService.modificarCliente(id,req.body);

        res.json(cliente);
    } catch (error) {
        console.error(error);

        if (error.status) {
            return res.status(error.status).json({error: error.message});
        }

        res.status(500).json({error: "Error al modificar el cliente"});
    }
};

const eliminarCliente = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if(!Number.isInteger(id) || id <= 0){
            return res.status(400).json({error: "ID incorrecto"});
        }

        const clienteExistente = await clienteService.obtenerClientePorId(id);

        if (!clienteExistente) {
            return res.status(404).json({error: "Cliente no encontrado"});
        }

        await clienteService.eliminarCliente(id);

        res.json({mensaje: "Cliente eliminado"});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error al eliminar el cliente"});
    }
};

module.exports = {
    obtenerClientes,
    obtenerClientePorId,
    crearCliente,
    modificarCliente,
    eliminarCliente
};