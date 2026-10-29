export class Reserva {
    constructor(idMesa, fechaHoraReservada, cantComensales, estadoReserva, dni) {
        this.idMesa = idMesa;
        this.fechaHoraReservada = fechaHoraReservada;
        this.cantComensales = cantComensales;
        this.estadoReserva = estadoReserva;
        this.dni = dni;
    }
}

export const ESTADOS_RESERVA = ["Activa", "En curso", "Finalizada", "Cancelada"];

export const COLORES_ESTADO_RESERVA = {
    "Activa": "bg-warning text-dark",
    "En curso": "bg-info text-dark",
    "Finalizada": "bg-success",
    "Cancelada": "bg-secondary"
};

export const formatearFechaHora = (iso) =>
    new Date(iso).toLocaleString("es-AR", {
        dateStyle: "short",
        timeStyle: "short"
    });