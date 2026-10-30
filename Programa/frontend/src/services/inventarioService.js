import { apiFetch } from "./api";

const obtenerMensajeError = (datos) => {
    return datos.detalles
        ? datos.detalles.map((detalle) => detalle.message).join(". ")
        : datos.error;
};

export const obtenerInventarios = async ({ productoId = "", stockBajo = false } = {}) => {
    const parametros = new URLSearchParams();

    if (productoId) {
        parametros.append("productoId", productoId);
    }

    if (stockBajo) {
        parametros.append("stockBajo", "true");
    }

    const consulta = parametros.toString();
    const ruta = consulta ? `/inventario?${consulta}` : "/inventario";
    const response = await apiFetch(ruta);

    if (!response.ok) {
        throw new Error("No se pudo obtener el inventario");
    }

    return await response.json();
};

export const crearInventario = async (inventario) => {
    const response = await apiFetch("/inventario", {
        method: "POST",
        body: JSON.stringify(inventario)
    });

    const datos = await response.json();

    if (!response.ok) {
        throw new Error(obtenerMensajeError(datos));
    }

    return datos;
};

export const modificarInventario = async (id, inventario) => {
    const response = await apiFetch(`/inventario/${id}`, {
        method: "PUT",
        body: JSON.stringify(inventario)
    });

    const datos = await response.json();

    if (!response.ok) {
        throw new Error(obtenerMensajeError(datos));
    }

    return datos;
};

export const eliminarInventario = async (id) => {
    const response = await apiFetch(`/inventario/${id}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        throw new Error("No se pudo eliminar el registro de inventario");
    }
};