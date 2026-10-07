const { z } = require("zod");

const pagoSchema = z.object({
    idPedido: z.number().int().positive("El idPedido debe ser un número positivo"),
    metodoPago: z.string().trim().min(1, "El método de pago es obligatorio")
});

module.exports = { pagoSchema };