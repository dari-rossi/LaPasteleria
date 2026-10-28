const { z } = require("zod");
const { itemProductoSchema } = require("./itemProducto.schema");
const { ESTADOS_PEDIDO } = require("../config/estadosPedido");

// Cada producto del pedido (el pedidoId todavía no existe: se crea junto con el pedido)
const itemDelPedidoSchema = itemProductoSchema.omit({ pedidoId: true });

const pedidoSchema = z.object({
    comensales: z.number().int("La cantidad de comensales debe ser un entero").positive("La cantidad de comensales debe ser positiva"),
    mesaId: z.number().int("La mesa es obligatoria").positive("La mesa es obligatoria"),
    clienteId: z.number().int("El cliente es obligatorio").positive("El cliente es obligatorio"),
    sucursalId: z.number().int("La sucursal es obligatoria").positive("La sucursal es obligatoria"),
    // Los productos son opcionales: el pedido puede nacer sin items y cargarse después desde /itemProducto
    items: z.array(itemDelPedidoSchema)
        .refine(
            (items) => new Set(items.map((item) => item.productoId)).size === items.length,
            "No se puede repetir un producto en el mismo pedido"
        )
        .optional()
});

// Para modificar: la mesa, el cliente y la sucursal no se cambian, y los productos se manejan desde /itemProducto
const pedidoModificarSchema = z.object({
    estadoPedido: z.enum(ESTADOS_PEDIDO, {
        message: "El estado debe ser Pendiente, En preparación, Entregado, Pagado o Cancelado"}),
    comensales: z.number().int("La cantidad de comensales debe ser un entero").positive("La cantidad de comensales debe ser positiva")
});

module.exports = { pedidoSchema, pedidoModificarSchema };
