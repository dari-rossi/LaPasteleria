const API_URL = "http://localhost:3000/mesas";

const obtenerMensajeError = (datos) => {
    return datos.detalles
        ? datos.detalles.map((detalle) => detalle.message).join(". ")
        : datos.error;
};

export const obtenerMesas = async () => {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("No se pudieron obtener las mesas");
    }

    return await response.json();
};

export const crearMesa = async (mesa) => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(mesa)
    });

    const datos = await response.json();

    if (!response.ok) {
        throw new Error(obtenerMensajeError(datos));
    }
    return datos;
};

export const modificarMesa = async (id, mesa) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(mesa)
    });

    const datos = await response.json();

    if (!response.ok) {
        throw new Error(obtenerMensajeError(datos));
    }
    return datos;
};

export const eliminarMesa = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {method: "DELETE"});
    if (!response.ok) {
        throw new Error("No se pudo eliminar la mesa");
    }
    return await response.json();
};