const { z } = require('zod');

const inventarioSchema = z.object({
  stock: z.number().int().min(0, "El stock no puede ser negativo"),
  stockMin: z.number().int().min(0, "El stock mínimo no puede ser negativo"),
  sucursalId: z.number().int().positive("El ID de la sucursal es obligatorio"),
  productoId: z.number().int().positive("El ID del producto es obligatorio")
});

module.exports = { inventarioSchema };