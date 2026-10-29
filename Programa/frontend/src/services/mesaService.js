import { apiFetch } from "./api";

const obtenerMensajeError = (datos) => {
    return datos.detalles
        ? datos.detalles.map((detalle) => detalle.message).join(". ")
        : datos.error;
};

export const obtenerMesas = async () => {
    const response = await apiFetch("/mesas");

    if (!response.ok) {
        throw new Error("No se pudieron obtener las mesas");
    }

    return await response.json();
};

export const crearMesa = async (mesa) => {
    const response = await apiFetch("/mesas", {
        method: "POST",
        body: JSON.stringify(mesa)
    });

    const datos = await response.json();

    if (!response.ok) {
        throw new Error(obtenerMensajeError(datos));
    }

    return datos;
};

export const modificarMesa = async (id, mesa) => {
    const response = await apiFetch(`/mesas/${id}`, {
        method: "PUT",
        body: JSON.stringify(mesa)
    });

    const datos = await response.json();

    if (!response.ok) {
        throw new Error(obtenerMensajeError(datos));
    }

    return datos;
};

export const eliminarMesa = async (id) => {
    const response = await apiFetch(`/mesas/${id}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        throw new Error("No se pudo eliminar la mesa");
    }

    return await response.json();
};