export class Pago {
    constructor(idPedido, fechaHora, precio, tipoDescuento, metodoPago, precioFinal) {
        this.idPedido = idPedido;
        this.fechaHora = fechaHora;
        this.precio = precio;
        this.tipoDescuento = tipoDescuento;
        this.metodoPago = metodoPago;
        this.precioFinal = precioFinal;
    }
}