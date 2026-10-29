const { z } = require("zod");

const pagoSchema = z.object({
    idPedido: z.number().int().positive("El idPedido debe ser un número positivo"),
    metodoPago: z.enum(["Efectivo", "Tarjeta", "Transferencia"], {
        message: "El método de pago debe ser Efectivo, Tarjeta o Transferencia"
    })
});

module.exports = { pagoSchema };