export class Producto {
    constructor(idProducto, nombre, tipoProducto, descripcion, stockMinimo, precio, precioFinal, proveedor) {
        this.idProducto = idProducto;
        this.nombre = nombre;
        this.tipoProducto = tipoProducto;
        this.descripcion = descripcion;
        this.precio = precio;
        this.precioFinal = precioFinal;
        this.proveedor = proveedor;
        this.stockMinimo = stockMinimo;
    }
}