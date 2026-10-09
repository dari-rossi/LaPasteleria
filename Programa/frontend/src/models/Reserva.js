export class Reserva {
    constructor(idMesa, fechaHoraReservada, cantComensales, estadoReserva, dni) {
        this.idMesa = idMesa;
        this.fechaHoraReservada = fechaHoraReservada;
        this.cantComensales = cantComensales;
        this.estadoReserva = estadoReserva;
        this.dni = dni;
    }
}