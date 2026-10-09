export const ESTADOS_MESA = ["Libre", "Ocupada", "Reservada"];

export class Mesa {
    constructor(idMesa, estado, maxComensales) {
        this.idMesa = idMesa;
        this.estado = estado;
        this.maxComensales = maxComensales;
    }
}