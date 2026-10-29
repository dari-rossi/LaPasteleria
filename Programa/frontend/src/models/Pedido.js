export const ESTADOS_PEDIDO = ["Pendiente", "En preparación", "Entregado", "Pagado", "Cancelado"];
export const ESTADOS_FINALES = ["Pagado", "Cancelado"];
export const ESTADOS_EDITABLES = ["Pendiente", "En preparación", "Entregado", "Cancelado"];
export const METODOS_PAGO = ["Efectivo", "Tarjeta", "Transferencia"];


export const COLORES_ESTADO_PEDIDO = {
    "Pendiente": "bg-secondary",
    "En preparación": "bg-warning text-dark",
    "Entregado": "bg-info text-dark",
    "Pagado": "bg-success",
    "Cancelado": "bg-danger"
};

export const calcularTotal = (pedido) =>
    pedido.items.reduce((acumulado, item) => acumulado + item.subTotal, 0);

export const calcularTotalConDescuento = (pedido) =>
    calcularTotal(pedido) * (1 - (pedido.cliente?.descuento ?? 0) / 100);

export const formatearPrecio = (valor) =>
    valor.toLocaleString("es-AR", {style: "currency", currency: "ARS"});

export const pedidoEditable = (pedido) => !ESTADOS_FINALES.includes(pedido.estadoPedido);

export const productoDisponibleAhora = (producto) => {
    const hora = new Date().getHours();

    if (producto.tipoProducto === "Día") return hora >= 7 && hora < 20;
    if (producto.tipoProducto === "Noche") return hora >= 20 || hora < 3;
    return true;
};