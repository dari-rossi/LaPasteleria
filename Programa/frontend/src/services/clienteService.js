import { apiFetch } from "./api";

const obtenerMensajeError = (datos) => {
    return datos.detalles
        ? datos.detalles.map((detalle) => detalle.message).join(". ")
        : datos.error;
};

export const obtenerClientes = async () => {
    const response = await apiFetch("/clientes");
    const datos = await response.json();

    if (!response.ok) {
        throw new Error("No se pudieron obtener los clientes");
    }

    return datos;
};

export const crearCliente = async (cliente) => {
    const response = await apiFetch("/clientes", {
        method: "POST",
        body: JSON.stringify(cliente)
    });

    const datos = await response.json();

    if (!response.ok) {
        throw new Error(obtenerMensajeError(datos));
    }

    return datos;
};

export const modificarCliente = async (id, cliente) => {
    const response = await apiFetch(`/clientes/${id}`, {
        method: "PUT",
        body: JSON.stringify(cliente)
    });

    const datos = await response.json();

    if (!response.ok) {
        throw new Error(obtenerMensajeError(datos));
    }

    return datos;
};

export const eliminarCliente = async (id) => {
    const response = await apiFetch(`/clientes/${id}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        throw new Error("No se pudo eliminar el cliente");
    }

    return await response.json();
};