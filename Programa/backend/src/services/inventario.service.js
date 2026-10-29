const inventarioRepository = require("../repositories/inventario.repository");
const sucursalRepository = require("../repositories/sucursal.repository");
const productoRepository = require("../repositories/producto.repository");
const { lanzarError } = require("../config/errores");

const verificarAcceso = (inventario, usuario) => {
    if (!inventario) {
        lanzarError("INVENTARIO_NO_ENCONTRADO");
    }

    if (usuario.rol !== "DUENIO" &&
        Number(inventario.sucursalId) !== Number(usuario.sucursalId)) {
        lanzarError("OTRA_SUCURSAL");
    }
};

const obtenerInventarios = async (usuario) => {
    if (usuario.rol === "DUENIO") {
        return await inventarioRepository.getAll();
    }

    return await inventarioRepository.getAll(usuario.sucursalId);
};

const crearInventario = async (data, usuario) => {
    if (usuario.rol !== "DUENIO") {
        lanzarError("SOLO_DUENIO");
    }

    const sucursal = await sucursalRepository.obtenerPorId(data.sucursalId);

    if (!sucursal) {
        lanzarError("SUCURSAL_NO_ENCONTRADA");
    }

    const producto = await productoRepository.obtenerPorId(data.productoId);

    if (!producto) {
        lanzarError("PRODUCTO_NO_ENCONTRADO");
    }

    // Si el producto ya está en esa sucursal, Prisma avisa (P2002) y se traduce a INVENTARIO_DUPLICADO
    return await inventarioRepository.create(data);
};

const actualizarInventario = async (id, data, usuario) => {
    const inventario = await inventarioRepository.getById(id);
    verificarAcceso(inventario, usuario);

    if (usuario.rol === "AYUDANTE_COCINA") {
        const campos = Object.keys(data);

        if (campos.some(campo => campo !== "stock") ||
            !Object.prototype.hasOwnProperty.call(data, "stock")) {
            lanzarError("INVENTARIO_SOLO_STOCK");
        }

        return await inventarioRepository.update(id, {
            stock: data.stock
        });
    }

    if (usuario.rol !== "DUENIO") {
        lanzarError("SIN_PERMISOS");
    }

    return await inventarioRepository.update(id, data);
};

const eliminarInventario = async (id, usuario) => {
    if (usuario.rol !== "DUENIO") {
        lanzarError("SOLO_DUENIO");
    }

    const inventario = await inventarioRepository.getById(id);
    verificarAcceso(inventario, usuario);

    return await inventarioRepository.remove(id);
};

module.exports = {
    obtenerInventarios,
    crearInventario,
    actualizarInventario,
    eliminarInventario
};