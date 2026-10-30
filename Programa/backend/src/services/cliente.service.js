const clienteRepository = require("../repositories/cliente.repository");
const { lanzarError } = require("../config/errores");

const normalizarTipo = (tipo) => {
    const texto = tipo.trim().toLowerCase();

    return texto.charAt(0).toUpperCase() + texto.slice(1);
};

const buscarCliente = async (id) => {
    const cliente = await clienteRepository.obtenerPorId(id);

    if (!cliente) {
        lanzarError("CLIENTE_NO_ENCONTRADO");
    }

    return cliente;
};

const verificarTipoDisponible = async (tipo, idExcluir = null) => {
    const clienteExistente = await clienteRepository.obtenerPorTipo(tipo);

    if (clienteExistente && clienteExistente.id !== idExcluir) {
        lanzarError("Ya existe una categoría de cliente con ese nombre.", 409);
    }
};

const obtenerClientes = async () => {
    return await clienteRepository.obtenerTodos();
};

const obtenerClientePorId = async (id) => {
    return await buscarCliente(id);
};

const crearCliente = async (datos) => {
    const tipo = normalizarTipo(datos.tipo);

    await verificarTipoDisponible(tipo);

    return await clienteRepository.crear({
        tipo,
        descuento: datos.descuento
    });
};

const modificarCliente = async (id, datos) => {
    await buscarCliente(id);

    const tipo = normalizarTipo(datos.tipo);

    await verificarTipoDisponible(tipo, id);

    return await clienteRepository.modificar(id, {
        tipo,
        descuento: datos.descuento
    });
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