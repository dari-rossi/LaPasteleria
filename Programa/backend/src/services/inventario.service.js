const inventarioRepository = require('../repositories/inventario.repository');

const lanzarError = (mensaje, status) => {
  const error = new Error(mensaje);
  error.status = status;
  throw error;
};

const verificarAcceso = (inventario, usuario) => {
  if (!inventario) {
    lanzarError("Inventario no encontrado", 404);
  }

  if (usuario.rol !== "DUENIO" &&
      Number(inventario.sucursalId) !== Number(usuario.sucursalId)) {
    lanzarError("No tenés permiso para acceder a otra sucursal", 403);
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
    lanzarError("Solo el dueño puede crear registros de inventario", 403);
  }

  return await inventarioRepository.create(data);
};

const actualizarInventario = async (id, data, usuario) => {
  const inventario = await inventarioRepository.getById(id);
  verificarAcceso(inventario, usuario);

  if (usuario.rol === "AYUDANTE_COCINA") {
    const campos = Object.keys(data);

    if (campos.some(campo => campo !== "stock") ||
        !Object.prototype.hasOwnProperty.call(data, "stock")) {
      lanzarError("Solo podés modificar el stock", 403);
    }

    return await inventarioRepository.update(id, {
      stock: data.stock
    });
  }

  if (usuario.rol !== "DUENIO") {
    lanzarError("No tenés permiso para modificar el inventario", 403);
  }

  return await inventarioRepository.update(id, data);
};

const eliminarInventario = async (id, usuario) => {
  if (usuario.rol !== "DUENIO") {
    lanzarError("Solo el dueño puede eliminar registros de inventario", 403);
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