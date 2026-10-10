const tipoEmpleadoRepository = require("../repositories/tipoEmpleado.repository");
const { TIPOS_PERMITIDOS, esDuenio, nombreOficial } = require("../config/tiposEmpleado");

const lanzarError = (mensaje, status) => {
    const error = new Error(mensaje);
    error.status = status;
    throw error;
};

// La contraseña nunca sale por la API
const sinContrasenia = (tipo) => {
    const { contrasenia, ...resto } = tipo;
    return resto;
};

const validarNombre = (nombre) => {
    if (esDuenio(nombre)) {
        lanzarError("El Dueño es una cuenta predefinida: ya es parte del sistema.", 409);
    }

    const oficial = nombreOficial(nombre);

    if (!oficial) {
        lanzarError(
            `"${nombre.trim()}" no es parte del sistema. Los tipos de empleado permitidos son: ${TIPOS_PERMITIDOS.join(", ")}.`,
            400
        );
    }

    return oficial;
};

const verificarNombreLibre = async (nombre, idActual) => {
    const existente = await tipoEmpleadoRepository.obtenerPorNombre(nombre);

    if (existente && existente.id !== idActual) {
        lanzarError(`El tipo "${nombre}" ya es parte del sistema.`, 409);
    }
};

const verificarUsuarioLibre = async (usuario, idActual) => {
    const existente = await tipoEmpleadoRepository.obtenerPorUsuario(usuario);

    if (existente && existente.id !== idActual) {
        lanzarError("Ya existe un tipo de empleado con ese usuario.", 409);
    }
};

const obtenerTiposEmpleado = async (tipoEmpleado) => {
    const tipos = await tipoEmpleadoRepository.obtenerTodos(tipoEmpleado);

    // Cada tipo trae la cantidad total de empleados: suma lo cargado en todas las sucursales
    return tipos
        .filter((tipo) => !esDuenio(tipo.tipoEmpleado))
        .map(({ sucursales, contrasenia, ...tipo }) => ({
            ...tipo,
            cantidadAsignada: sucursales.reduce((total, item) => total + item.cantidad, 0)
        }));
};

const obtenerTipoEmpleadoPorId = async (id) => {
    const tipo = await tipoEmpleadoRepository.obtenerPorId(id);

    return tipo && !esDuenio(tipo.tipoEmpleado) ? sinContrasenia(tipo) : null;
};

const crearTipoEmpleado = async (datos) => {
    const nombre = validarNombre(datos.tipoEmpleado);

    // usuario y contraseña se cargan juntos o ninguno de los dos
    if (Boolean(datos.usuario) !== Boolean(datos.contrasenia)) {
        lanzarError("El usuario y la contraseña deben cargarse juntos.", 400);
    }

    await verificarNombreLibre(nombre);

    if (datos.usuario) {
        await verificarUsuarioLibre(datos.usuario);
    }

    const tipo = await tipoEmpleadoRepository.crear({
        tipoEmpleado: nombre,
        sueldo: datos.sueldo,
        usuario: datos.usuario ?? null,
        contrasenia: datos.contrasenia ?? null
    });

    return sinContrasenia(tipo);
};

const modificarTipoEmpleado = async (id, datos) => {
    const existente = await tipoEmpleadoRepository.obtenerPorId(id);

    if (!existente || esDuenio(existente.tipoEmpleado)) {
        lanzarError("Tipo de empleado no encontrado", 404);
    }
    const nombre = validarNombre(datos.tipoEmpleado);

    await verificarNombreLibre(nombre, id);

    const cambios = {
        tipoEmpleado: nombre,
        sueldo: datos.sueldo
    };

    if (datos.usuario) {
        await verificarUsuarioLibre(datos.usuario, id);
        cambios.usuario = datos.usuario;
    }

    if (datos.contrasenia) {
        cambios.contrasenia = datos.contrasenia;
    }

    // Después del cambio, usuario y contraseña tienen que estar los dos o ninguno
    const usuarioFinal = cambios.usuario ?? existente.usuario;
    const contraseniaFinal = cambios.contrasenia ?? existente.contrasenia;

    if (Boolean(usuarioFinal) !== Boolean(contraseniaFinal)) {
        lanzarError("El usuario y la contraseña deben cargarse juntos.", 400);
    }

    const tipo = await tipoEmpleadoRepository.modificar(id, cambios);

    return sinContrasenia(tipo);
};

const eliminarTipoEmpleado = async (id) => {
    const existente = await tipoEmpleadoRepository.obtenerPorId(id);

    if (!existente || esDuenio(existente.tipoEmpleado)) {
        lanzarError("Tipo de empleado no encontrado", 404);
    }

    return await tipoEmpleadoRepository.eliminar(id);
};

module.exports = {
    obtenerTiposEmpleado,
    obtenerTipoEmpleadoPorId,
    crearTipoEmpleado,
    modificarTipoEmpleado,
    eliminarTipoEmpleado
};
