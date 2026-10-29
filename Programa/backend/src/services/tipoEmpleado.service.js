const tipoEmpleadoRepository = require("../repositories/tipoEmpleado.repository");
const { ROLES, esDuenio } = require("../config/tiposEmpleado");
const { lanzarError } = require("../config/errores");

// Busca un tipo de empleado o lanza 404. El Dueño no se gestiona desde acá
const buscarTipo = async (id) => {
    const tipo = await tipoEmpleadoRepository.obtenerPorId(id);

    if (!tipo || esDuenio(tipo.rol)) {
        lanzarError("TIPO_EMPLEADO_NO_ENCONTRADO");
    }

    return tipo;
};

const obtenerTiposEmpleado = async (rol, usuario) => {
    if (rol && !ROLES.includes(rol)) {
        lanzarError("ROL_INVALIDO", `El rol debe ser uno de: ${ROLES.join(", ")}`);
    }

    const tipos = await tipoEmpleadoRepository.obtenerTodos(rol);

    return tipos
        .filter((tipo) => !esDuenio(tipo.rol))
        .map(({ sucursales, ...tipo }) => {
            const cantidadAsignada = usuario.rol === "DUENIO"
                ? sucursales.reduce((total, item) => total + item.cantidad, 0)
                : sucursales
                    .filter((item) => Number(item.sucursalId) === Number(usuario.sucursalId))
                    .reduce((total, item) => total + item.cantidad, 0);

            return {
                ...tipo,
                cantidadAsignada
            };
        });
};

const obtenerTipoEmpleadoPorId = async (id) => {
    return await buscarTipo(id);
};

const crearTipoEmpleado = async (datos) => {
    if (esDuenio(datos.rol)) {
        lanzarError("ROL_DUENIO_PREDEFINIDO");
    }

    const existente = await tipoEmpleadoRepository.obtenerPorRol(datos.rol);

    if (existente) {
        lanzarError("TIPO_EMPLEADO_DUPLICADO");
    }

    return await tipoEmpleadoRepository.crear({
        rol: datos.rol,
        sueldo: datos.sueldo
    });
};

const modificarTipoEmpleado = async (id, datos) => {
    await buscarTipo(id);

    // El rol no se modifica: solo el sueldo
    return await tipoEmpleadoRepository.modificar(id, { sueldo: datos.sueldo });
};

const eliminarTipoEmpleado = async (id) => {
    await buscarTipo(id);

    const usuarios = await tipoEmpleadoRepository.contarUsuarios(id);

    if (usuarios > 0) {
        lanzarError("TIPO_EMPLEADO_CON_USUARIOS");
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