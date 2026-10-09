const API_URL = "http://localhost:3000/reservas";

const obtenerMensajeError = (datos) => {
    return datos.detalles
        ? datos.detalles.map((detalle) => detalle.message).join(". ")
        : datos.error;
};

// La clave compuesta viaja en la URL; la fecha lleva ":" y hay que codificarla
const urlReserva = (idMesa, fechaHora) => {
    return `${API_URL}/${idMesa}/${encodeURIComponent(fechaHora)}`;
};

export const obtenerReservas = async () => {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("No se pudieron obtener las reservas");
    }

    return await response.json();
};

export const crearReserva = async (reserva) => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(reserva)
    });

    const datos = await response.json();

    if (!response.ok) {
        throw new Error(obtenerMensajeError(datos));
    }
    return datos;
};

export const modificarReserva = async (idMesa, fechaHora, reserva) => {
    const response = await fetch(urlReserva(idMesa, fechaHora), {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(reserva)
    });

    const datos = await response.json();

    if (!response.ok) {
        throw new Error(obtenerMensajeError(datos));
    }
    return datos;
};

export const eliminarReserva = async (idMesa, fechaHora) => {
    const response = await fetch(urlReserva(idMesa, fechaHora), {method: "DELETE"});
    if (!response.ok) {
        throw new Error("No se pudo eliminar la reserva");
    }
    return await response.json();
};