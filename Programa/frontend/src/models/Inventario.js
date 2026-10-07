export class Inventario {
    constructor(id, stock, stockMin, sucursalId, productoId) {
        this.id = id;
        this.stock = stock;
        this.stockMin = stockMin;
        this.sucursalId = sucursalId;
        this.productoId = productoId;
    }
}