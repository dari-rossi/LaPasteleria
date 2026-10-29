import { apiFetch } from "./api";

const obtenerMensajeError = (datos) => {
    return datos.detalles
        ? datos.detalles.map((detalle) => detalle.message).join(". ")
        : datos.error;
};

// POST, PUT y DELETE comparten la misma forma de pedir y de leer los errores
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

export const obtenerTiposEmpleado = async (tipoEmpleado = "") => {
    const ruta = tipoEmpleado
        ? `/tipos-empleado?tipoEmpleado=${encodeURIComponent(tipoEmpleado)}`
        : "/tipos-empleado";

    const response = await apiFetch(ruta);

    if (!response.ok) {
        throw new Error("No se pudieron obtener los tipos de empleado");
    }

    return await response.json();
};

export const crearTipoEmpleado = (tipo) =>
    enviar("/tipos-empleado", "POST", tipo);

export const modificarTipoEmpleado = (id, tipo) =>
    enviar(`/tipos-empleado/${id}`, "PUT", tipo);

export const eliminarTipoEmpleado = (id) =>
    enviar(`/tipos-empleado/${id}`, "DELETE");