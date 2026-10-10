const { z } = require("zod");

const cantidadSchema = z.number().int("La cantidad debe ser un número entero").positive("La cantidad debe ser mayor a 0");

const asignarTipoEmpleadoSchema = z.object({
    tipoEmpleadoId: z.number().int("El tipo de empleado es obligatorio").positive("El tipo de empleado es obligatorio"),
    cantidad: cantidadSchema
});

const modificarCantidadSchema = z.object({
    cantidad: cantidadSchema
});

module.exports = { asignarTipoEmpleadoSchema, modificarCantidadSchema };
