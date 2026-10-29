const clienteRepository = require("../repositories/cliente.repository");
const { lanzarError } = require("../config/errores");

const obtenerDescuento = (tipo) => {
    if (tipo === "Jubilado") {
        return 20;
    }

    if (tipo === "Estudiante") {
        return 15;
    }

    return 0;
};

// Busca un cliente o lanza 404
const buscarCliente = async (id) => {
    const cliente = await clienteRepository.obtenerPorId(id);

    if (!cliente) {
        lanzarError("CLIENTE_NO_ENCONTRADO");
    }

    return cliente;
};

const obtenerClientes = async () => {
    return await clienteRepository.obtenerTodos();
};

const obtenerClientePorId = async (id) => {
    return await buscarCliente(id);
};

const crearCliente = async (datos) => {
    const descuentoCalculado = obtenerDescuento(datos.tipo);
    const nuevoClienteData = { tipo: datos.tipo, descuento: descuentoCalculado };

    return await clienteRepository.crear(nuevoClienteData);
};

const modificarCliente = async (id, datos) => {
    await buscarCliente(id);

    const descuentoCalculado = obtenerDescuento(datos.tipo);
    const clienteActualizarData = { tipo: datos.tipo, descuento: descuentoCalculado };

    return await clienteRepository.modificar(id, clienteActualizarData);
};

const eliminarCliente = async (id) => {
    await buscarCliente(id);

    return await clienteRepository.eliminar(id);
};

module.exports = {
    obtenerClientes,
    obtenerClientePorId,
    crearCliente,
    modificarCliente,
    eliminarCliente
};