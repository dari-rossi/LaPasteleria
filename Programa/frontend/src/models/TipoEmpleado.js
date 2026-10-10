// La contraseña nunca viaja desde el backend, por eso no está acá
export class TipoEmpleado {
    constructor(id, tipoEmpleado, sueldo, usuario, cantidadAsignada) {
        this.id = id;
        this.tipoEmpleado = tipoEmpleado;
        this.sueldo = sueldo;
        this.usuario = usuario;
        this.cantidadAsignada = cantidadAsignada;
    }
}
