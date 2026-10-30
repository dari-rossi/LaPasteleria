const { z } = require("zod");

const ESTADOS_MESA = ["Libre", "Ocupada", "Reservada"];

const mesaSchema = z.object({
    fila: z.number().int().positive("La fila debe ser mayor a 0").optional(),
columna: z.number().int().positive("La columna debe ser mayor a 0").optional(),
    estado: z.enum(ESTADOS_MESA, {
        error: "El estado debe ser Libre, Ocupada o Reservada"
    }),
    maxComensales: z
        .number({ error: "La cantidad máxima de comensales debe ser un número" })
        .int("La cantidad máxima de comensales debe ser un número entero")
        .positive("La cantidad máxima de comensales debe ser mayor a 0"),
    sucursalId: z
        .number({ error: "La sucursal debe ser un número" })
        .int("La sucursal debe ser un número entero")
        .positive("La sucursal debe ser mayor a 0")
        .optional()
});

// Al modificar no se puede cambiar de sucursal
const mesaModificarSchema = mesaSchema.omit({ sucursalId: true });

module.exports = { mesaSchema, mesaModificarSchema, ESTADOS_MESA };