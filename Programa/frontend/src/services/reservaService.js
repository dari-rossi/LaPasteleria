import { apiFetch } from "./api";

const obtenerMensajeError = (datos) => {
    return datos.detalles
        ? datos.detalles.map((detalle) => detalle.message).join(". ")
        : datos.error;
};

const urlReserva = (idMesa, fechaHora) => {
    return `/reservas/${idMesa}/${encodeURIComponent(fechaHora)}`;
};

export const obtenerReservas = async ({ estadoReserva = "" } = {}) => {
    const parametros = new URLSearchParams();

    if (estadoReserva) {
        parametros.append("estadoReserva", estadoReserva);
    }

    const consulta = parametros.toString();
    const ruta = consulta ? `/reservas?${consulta}` : "/reservas";
    const response = await apiFetch(ruta);

    if (!response.ok) {
        throw new Error("No se pudieron obtener las reservas");
    }

    return await response.json();
};

export const crearReserva = async (reserva) => {
    const response = await apiFetch("/reservas", {
        method: "POST",
        body: JSON.stringify(reserva)
    });

    const datos = await response.json();

    if (!response.ok) {
        throw new Error(obtenerMensajeError(datos));
    }

    return datos;
};

export const modificarReserva = async (idMesa, fechaHora, reserva) => {
    const response = await apiFetch(urlReserva(idMesa, fechaHora), {
        method: "PUT",
        body: JSON.stringify(reserva)
    });

    const datos = await response.json();

    if (!response.ok) {
        throw new Error(obtenerMensajeError(datos));
    }

    return datos;
};

export const eliminarReserva = async (idMesa, fechaHora) => {
    const response = await apiFetch(urlReserva(idMesa, fechaHora), {
        method: "DELETE"
    });

    if (!response.ok) {
        throw new Error("No se pudo eliminar la reserva");
    }

    return await response.json();
};