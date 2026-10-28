const bcrypt = require("bcryptjs");
const usuarioRepository = require("../repositories/usuario.repository");
const tipoEmpleadoRepository = require("../repositories/tipoEmpleado.repository");
const sucursalRepository = require("../repositories/sucursal.repository");
const { esDuenio } = require("../config/tiposEmpleado");
const { lanzarError } = require("../config/errores");

// Busca un usuario o lanza 404
const buscarUsuario = async (id) => {
    const usuario = await usuarioRepository.obtenerPorId(id);

    if (!usuario) {
        lanzarError("USUARIO_NO_ENCONTRADO");
    }

    return usuario;
};

// idActual: id del usuario que se está modificando (para no chocar consigo mismo)
const validarReglas = async (datos, idActual) => {
    const tipo = await tipoEmpleadoRepository.obtenerPorId(datos.idTipoEmpleado);

    if (!tipo) {
        lanzarError("TIPO_EMPLEADO_NO_ENCONTRADO");
    }

    const sucursalId = datos.sucursalId ?? null;

    if (esDuenio(tipo.rol)) {
        if (sucursalId !== null) {
            lanzarError("DUENIO_SIN_SUCURSAL");
        }
    } else {
        if (sucursalId === null) {
            lanzarError("SUCURSAL_OBLIGATORIA");
        }

        const sucursal = await sucursalRepository.obtenerPorId(sucursalId);

        if (!sucursal) {
            lanzarError("SUCURSAL_NO_ENCONTRADA");
        }
    }

    // Una sola cuenta por rol en cada sucursal (y un solo Dueño)
    const duplicado = await usuarioRepository.obtenerPorTipoYSucursal(datos.idTipoEmpleado, sucursalId);

    if (duplicado && duplicado.idUsuario !== idActual) {
        lanzarError(esDuenio(tipo.rol) ? "DUENIO_DUPLICADO" : "ROL_SUCURSAL_DUPLICADO");
    }

    const mismoNombre = await usuarioRepository.obtenerPorNombre(datos.nombreUsuario);

    if (mismoNombre && mismoNombre.idUsuario !== idActual) {
        lanzarError("USUARIO_DUPLICADO");
    }
};

const obtenerUsuarios = async (sucursalId) => {
    return await usuarioRepository.obtenerTodos(sucursalId);
};

const obtenerUsuarioPorId = async (id) => {
    return await buscarUsuario(id);
};

const crearUsuario = async (datos) => {
    await validarReglas(datos);

    return await usuarioRepository.crear({
        nombreUsuario: datos.nombreUsuario,
        contrasenia: await bcrypt.hash(datos.contrasenia, 12),
        idTipoEmpleado: datos.idTipoEmpleado,
        sucursalId: datos.sucursalId ?? null
    });
};

const modificarUsuario = async (id, datos, usuarioActual) => {
    const existente = await buscarUsuario(id);

    if (Number(id) === Number(usuarioActual.id) &&
        datos.idTipoEmpleado !== existente.idTipoEmpleado) {
        lanzarError("NO_CAMBIAR_PROPIO_ROL");
    }

    await validarReglas(datos, id);

    const cambios = {
        nombreUsuario: datos.nombreUsuario,
        idTipoEmpleado: datos.idTipoEmpleado,
        sucursalId: datos.sucursalId ?? null
    };

    if (datos.contrasenia) {
        cambios.contrasenia = await bcrypt.hash(datos.contrasenia, 12);
    }

    return await usuarioRepository.modificar(id, cambios);
};

const eliminarUsuario = async (id, usuarioActual) => {
    await buscarUsuario(id);

    if (Number(id) === Number(usuarioActual.id)) {
        lanzarError("NO_ELIMINAR_PROPIA_CUENTA");
    }

    return await usuarioRepository.eliminar(id);
};

module.exports = {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    modificarUsuario,
    eliminarUsuario
};