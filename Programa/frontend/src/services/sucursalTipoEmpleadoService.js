// Estas rutas cuelgan de /sucursales: /sucursales/:sucursalId/tipos-empleado
const API_URL = "http://localhost:3000/sucursales";

const obtenerMensajeError = (datos) => {
    return datos.detalles
        ? datos.detalles.map((detalle) => detalle.message).join(". ")
        : datos.error;
};

const enviar = async (url, metodo, cuerpo) => {
    const response = await fetch(url, {
        method: metodo,
        headers: {"Content-Type": "application/json"},
        body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo)
    });

    const datos = await response.json();

    if (!response.ok) {
        throw new Error(obtenerMensajeError(datos));
    }
    return datos;
};

export const obtenerTiposDeSucursal = async (sucursalId) => {
    const response = await fetch(`${API_URL}/${sucursalId}/tipos-empleado`);

    if (!response.ok) {
        const datos = await response.json();
        throw new Error(obtenerMensajeError(datos));
    }

    return await response.json();
};

export const asignarTipoEmpleado = (sucursalId, asignacion) =>
    enviar(`${API_URL}/${sucursalId}/tipos-empleado`, "POST", asignacion);

export const modificarCantidad = (sucursalId, tipoEmpleadoId, cantidad) =>
    enviar(`${API_URL}/${sucursalId}/tipos-empleado/${tipoEmpleadoId}`, "PUT", { cantidad });

export const quitarTipoEmpleado = (sucursalId, tipoEmpleadoId) =>
    enviar(`${API_URL}/${sucursalId}/tipos-empleado/${tipoEmpleadoId}`, "DELETE");
