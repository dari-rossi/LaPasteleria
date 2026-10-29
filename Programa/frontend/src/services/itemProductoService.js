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

export const agregarItem = (item) =>
    enviar("/itemProducto", "POST", item);

export const modificarCantidad = (id, cantidad) =>
    enviar(`/itemProducto/${id}`, "PUT", { cantidad });

export const quitarItem = (id) =>
    enviar(`/itemProducto/${id}`, "DELETE");