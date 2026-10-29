import { apiFetch } from "./api";

const obtenerMensajeError = (datos) => {
    return datos.detalles
        ? datos.detalles.map((detalle) => detalle.message).join(". ")
        : datos.error;
};

const enviar = async (ruta, metodo, cuerpo) => {
    const response = await apiFetch(ruta, {
        method: metodo,
        body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo)
    });

    const datos = await response.json();

    if (!response.ok) {
        throw new Error(obtenerMensajeError(datos));
    }

    return datos;
};

export const obtenerTiposDeSucursal = async (sucursalId) => {
    const response = await apiFetch(`/sucursales/${sucursalId}/tipos-empleado`);

    if (!response.ok) {
        const datos = await response.json();
        throw new Error(obtenerMensajeError(datos));
    }

    return await response.json();
};

export const asignarTipoEmpleado = (sucursalId, asignacion) =>
    enviar(`/sucursales/${sucursalId}/tipos-empleado`, "POST", asignacion);

export const modificarCantidad = (sucursalId, tipoEmpleadoId, cantidad) =>
    enviar(`/sucursales/${sucursalId}/tipos-empleado/${tipoEmpleadoId}`, "PUT", { cantidad });

export const quitarTipoEmpleado = (sucursalId, tipoEmpleadoId) =>
    enviar(`/sucursales/${sucursalId}/tipos-empleado/${tipoEmpleadoId}`, "DELETE");