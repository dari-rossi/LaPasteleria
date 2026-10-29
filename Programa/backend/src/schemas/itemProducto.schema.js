const { z } = require("zod");

const itemProductoSchema = z.object({
    pedidoId: z.number().int().positive("El ID del pedido es obligatorio"),
    productoId: z.number().int().positive("El ID del producto es obligatorio"),
    cantidad: z.number().int().positive("La cantidad debe ser mayor a 0")
});

// Al modificar solo se puede cambiar la cantidad
const itemProductoModificarSchema = z.object({
    cantidad: z.number().int().positive("La cantidad debe ser mayor a 0")
});

module.exports = { itemProductoSchema, itemProductoModificarSchema };