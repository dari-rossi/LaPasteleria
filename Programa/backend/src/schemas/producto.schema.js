const { z } = require("zod");

const productoSchema = z.object({
    nombre: z.string().trim().min(1, "El nombre es obligatorio"),
    tipoProducto: z.string().trim().min(1, "El tipo de producto es obligatorio"),
    descripcion: z.string().optional(),
    precio: z.number().positive("El precio debe ser un número positivo"),
    proveedor: z.string().trim().min(1, "El proveedor es obligatorio"),
    stockMinimo: z.number({ error: "El stock mínimo es obligatorio" })
        .int("El stock mínimo debe ser un número entero")
        .min(0, "El stock mínimo no puede ser negativo")
});

module.exports = { productoSchema };