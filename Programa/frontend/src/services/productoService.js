import { apiFetch } from "./api";

const obtenerMensajeError = (datos) => {
    return datos.detalles
        ? datos.detalles.map((detalle) => detalle.message).join(". ")
        : datos.error;
};

export const obtenerProductos = async () => {
    const response = await apiFetch("/productos");

    if (!response.ok) {
        throw new Error("No se pudieron obtener los productos");
    }

    return await response.json();
};

export const crearProducto = async (producto) => {
    const response = await apiFetch("/productos", {
        method: "POST",
        body: JSON.stringify(producto)
    });

    const datos = await response.json();

    if (!response.ok) {
        throw new Error(obtenerMensajeError(datos));
    }

    return datos;
};

export const modificarProducto = async (id, producto) => {
    const response = await apiFetch(`/productos/${id}`, {
        method: "PUT",
        body: JSON.stringify(producto)
    });

    const datos = await response.json();

    if (!response.ok) {
        throw new Error(obtenerMensajeError(datos));
    }

    return datos;
};

export const eliminarProducto = async (id) => {
    const response = await apiFetch(`/productos/${id}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        throw new Error("No se pudo eliminar el producto");
    }

    return await response.json();
};