const clienteRepository = require("../repositories/cliente.repository");

const obtenerDescuento = (tipo) => {
    if (tipo === "Jubilado") {
        return 20;
    }

    if (tipo === "Estudiante") {
        return 15;
    }

    return 0;
};

const obtenerClientes = async () => {
    return await clienteRepository.obtenerTodos();
};

const obtenerClientePorId = async (id) => {
    return await clienteRepository.obtenerPorId(id);
};

const crearCliente = async (datos) => {
    const descuentoCalculado = obtenerDescuento(datos.tipo);
    const nuevoClienteData = {tipo: datos.tipo,descuento: descuentoCalculado};

    return await clienteRepository.crear(nuevoClienteData);
};

const modificarCliente = async (id, datos) => {
    const descuentoCalculado = obtenerDescuento(datos.tipo);

    const clienteActualizarData = {tipo: datos.tipo,descuento: descuentoCalculado};

    return await clienteRepository.modificar(id, clienteActualizarData);
};

const eliminarCliente = async (id) => {
    return await clienteRepository.eliminar(id);
};

module.exports = {
    obtenerClientes,
    obtenerClientePorId,
    crearCliente,
    modificarCliente,
    eliminarCliente
};