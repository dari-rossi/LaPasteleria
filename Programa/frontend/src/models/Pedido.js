export const ESTADOS_PEDIDO = ["Pendiente", "En preparación", "Entregado", "Pagado", "Cancelado"];

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