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

export const obtenerTiposEmpleado = async (rol = "") => {
    const ruta = rol
        ? `/tipos-empleado?rol=${encodeURIComponent(rol)}`
        : "/tipos-empleado";

    const response = await apiFetch(ruta);

    if (!response.ok) {
        throw new Error("No se pudieron obtener los tipos de empleado");
    }

    return await response.json();
};

export const modificarTipoEmpleado = (id, tipo) =>
    enviar(`/tipos-empleado/${id}`, "PUT", tipo);