export class Producto {
    constructor(idProducto, nombre, tipoProducto, descripcion, stockMin, precio, precioFinal, proveedor) {
        this.idProducto = idProducto;
        this.nombre = nombre;
        this.tipoProducto = tipoProducto;
        this.descripcion = descripcion;
        this.stockMin = stockMin;
        this.precio = precio;
        this.precioFinal = precioFinal;
        this.proveedor = proveedor;
    }
}