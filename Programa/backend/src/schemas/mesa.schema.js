const { z } = require("zod");

const ESTADOS_MESA = ["Libre", "Ocupada", "Reservada"];

const mesaSchema = z.object({
    estado: z.enum(ESTADOS_MESA, {
        error: "El estado debe ser Libre, Ocupada o Reservada"
    }),
    maxComensales: z
        .number({ error: "La cantidad máxima de comensales debe ser un número" })
        .int("La cantidad máxima de comensales debe ser un número entero")
        .positive("La cantidad máxima de comensales debe ser mayor a 0")
});

module.exports = { mesaSchema, ESTADOS_MESA };