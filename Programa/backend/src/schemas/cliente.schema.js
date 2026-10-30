const { z } = require("zod");

const clienteSchema = z.object({
    tipo: z.string()
        .trim()
        .min(1, "El tipo de cliente es obligatorio")
        .max(50, "El tipo de cliente no puede superar los 50 caracteres"),

    descuento: z.coerce.number()
        .int("El descuento debe ser un número entero")
        .min(0, "El descuento no puede ser negativo")
        .max(100, "El descuento no puede superar el 100%")
});

module.exports = { clienteSchema };