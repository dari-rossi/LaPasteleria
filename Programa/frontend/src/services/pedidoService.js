import { apiFetch } from "./api";

const obtenerMensajeError = (datos) => {
    return datos.detalles
        ? datos.detalles.map((detalle) => detalle.message).join(". ")
        : datos.error;
};

export const obtenerPedidos = async () => {
    const response = await apiFetch("/pedidos");

    if (!response.ok) {
        throw new Error("No se pudieron obtener los pedidos");
    }

    return await response.json();
};

export const obtenerPedidoPorId = async (id) => {
    const response = await apiFetch(`/pedidos/${id}`);

    if (!response.ok) {
        throw new Error("No se pudo obtener el pedido");
    }

    return await response.json();
};

export const crearPedido = async (pedido) => {
    const response = await apiFetch("/pedidos", {
        method: "POST",
        body: JSON.stringify(pedido)
    });

    const datos = await response.json();

    if (!response.ok) {
        throw new Error(obtenerMensajeError(datos));
    }

    return datos;
};

export const modificarPedido = async (id, pedido) => {
    const response = await apiFetch(`/pedidos/${id}`, {
        method: "PUT",
        body: JSON.stringify(pedido)
    });

    const datos = await response.json();

    if (!response.ok) {
        throw new Error(obtenerMensajeError(datos));
    }

    return datos;
};

export const eliminarPedido = async (id) => {
    const response = await apiFetch(`/pedidos/${id}`, {
        method: "DELETE"
    });

    const datos = await response.json();

    if (!response.ok) {
        throw new Error(obtenerMensajeError(datos));
    }

    return datos;
};