const API_URL = "http://localhost:3000/inventario";

const obtenerMensajeError = (datos) => {
    return datos.detalles
        ? datos.detalles.map((detalle) => detalle.message).join(". ")
        : datos.error;
};

export const obtenerInventarios = async () => {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("No se pudo obtener el inventario");
    }

    return await response.json();
};

export const crearInventario = async (inventario) => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(inventario)
    });

    const datos = await response.json();

    if (!response.ok) {
        throw new Error(obtenerMensajeError(datos));
    }
    return datos;
};

export const modificarInventario = async (id, inventario) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(inventario)
    });

    const datos = await response.json();

    if (!response.ok) {
        throw new Error(obtenerMensajeError(datos));
    }
    return datos;
};

export const eliminarInventario = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {method: "DELETE"});

    // El backend responde 204 sin cuerpo, por eso acá no se hace response.json()
    if (!response.ok) {
        throw new Error("No se pudo eliminar el registro de inventario");
    }
};