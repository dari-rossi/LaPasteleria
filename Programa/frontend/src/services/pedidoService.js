const API_URL = "http://localhost:3000/pedidos";

const obtenerMensajeError = (datos) => {
    return datos.detalles
        ? datos.detalles.map((detalle) => detalle.message).join(". ")
        : datos.error;
};

export const obtenerPedidos = async () => {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("No se pudieron obtener los pedidos");
    }

    return await response.json();
};

export const obtenerPedidoPorId = async (id) => {
    const response = await fetch(`${API_URL}/${id}`);

    if (!response.ok) {
        throw new Error("No se pudo obtener el pedido");
    }

    return await response.json();
};

export const crearPedido = async (pedido) => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(pedido)
    });

    const datos = await response.json();

    if (!response.ok) {
        throw new Error(obtenerMensajeError(datos));
    }
    return datos;
};

export const modificarPedido = async (id, pedido) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(pedido)
    });

    const datos = await response.json();

    if (!response.ok) {
        throw new Error(obtenerMensajeError(datos));
    }
    return datos;
};

export const eliminarPedido = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {method: "DELETE"});
    const datos = await response.json();

    if (!response.ok) {
        throw new Error(obtenerMensajeError(datos)); // ej: pedido con pago registrado
    }
    return datos;
};