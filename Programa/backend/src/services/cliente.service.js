const clienteRepository = require("../repositories/cliente.repository");

const lanzarError = (mensaje, status) => {
    const error = new Error(mensaje);
    error.status = status;
    throw error;
};

const normalizarTipo = (tipo) => {
    const texto = tipo.trim().toLowerCase();
    return texto.charAt(0).toUpperCase() + texto.slice(1);
};

const obtenerDescuento = (tipo) => {
    const descuentos = {
        Jubilado: 20,
        Estudiante: 15,
        General: 0
    };

    return descuentos[tipo];
};

const obtenerClientes = async () => {
    return await clienteRepository.obtenerTodos();
};

const obtenerClientePorId = async (id) => {
    const cliente = await clienteRepository.obtenerPorId(Number(id));

    if (!cliente) {
        lanzarError("Cliente no encontrado.", 404);
    }

    return cliente;
};

const crearCliente = async (datos) => {
    const tipo = normalizarTipo(datos.tipo);
    const descuento = obtenerDescuento(tipo);

    if (descuento === undefined) {
        lanzarError("El tipo de cliente no es válido.", 400);
    }

    return await clienteRepository.crear({
        tipo,
        descuento
    });
};

const modificarCliente = async (id, datos) => {
    const cliente = await clienteRepository.obtenerPorId(Number(id));

    if (!cliente) {
        lanzarError("Cliente no encontrado.", 404);
    }

    if (datos.descuento === undefined) {
        lanzarError("Debe indicar el descuento.", 400);
    }

    return await clienteRepository.modificar(Number(id), {
        descuento: Number(datos.descuento)
    });
};

const eliminarCliente = async (id) => {
    const cliente = await clienteRepository.obtenerPorId(Number(id));

    if (!cliente) {
        lanzarError("Cliente no encontrado.", 404);
    }

    return await clienteRepository.eliminar(Number(id));
};

module.exports = {
    obtenerClientes,
    obtenerClientePorId,
    crearCliente,
    modificarCliente,
    eliminarCliente
};