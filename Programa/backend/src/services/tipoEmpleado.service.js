const tipoEmpleadoRepository = require("../repositories/tipoEmpleado.repository");
const { ROLES, esDuenio } = require("../config/tiposEmpleado");
const { lanzarError } = require("../config/errores");

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

const modificarTipoEmpleado = async (id, datos) => {
    await buscarTipo(id);

    return await tipoEmpleadoRepository.modificar(id, {
        sueldo: datos.sueldo
    });
};

module.exports = {
    obtenerTiposEmpleado,
    obtenerTipoEmpleadoPorId,
    modificarTipoEmpleado
};