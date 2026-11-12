const { z } = require("zod");

const descuentoSchema = z.coerce
    .number({ error: "El descuento debe ser un número" })
    .int("El descuento debe ser un número entero")
    .min(0, "El descuento no puede ser negativo")
    .max(100, "El descuento no puede superar el 100%");
const crearClienteSchema = z.object({
    tipo: z.string({ error: "El tipo de cliente es obligatorio" })
        .trim()
        .min(1, "El tipo de cliente es obligatorio")
        .max(50, "El tipo de cliente no puede superar los 50 caracteres"),
    descuento: descuentoSchema
});

const modificarClienteSchema = z.object({
    descuento: descuentoSchema
});

module.exports = {
    crearClienteSchema,
    modificarClienteSchema
};