const clienteService = require("../services/cliente.service");
const { leerId } = require("../config/errores");

const obtenerClientes = async (req, res) => {
    const clientes = await clienteService.obtenerClientes();
    res.json(clientes);
};

const obtenerClientePorId = async (req, res) => {
    const id = leerId(req.params.id);
    const cliente = await clienteService.obtenerClientePorId(id);
    res.json(cliente);
};

const crearCliente = async (req, res) => {
    const cliente = await clienteService.crearCliente(req.body);
    res.status(201).json(cliente);
};

const modificarCliente = async (req, res) => {
    const id = leerId(req.params.id);
    const cliente = await clienteService.modificarCliente(id, req.body);
    res.json(cliente);
};

const eliminarCliente = async (req, res) => {
    const id = leerId(req.params.id);
    await clienteService.eliminarCliente(id);
    res.json({ mensaje: "Cliente eliminado" });
};

module.exports = {
    obtenerClientes,
    obtenerClientePorId,
    crearCliente,
    modificarCliente,
    eliminarCliente
};