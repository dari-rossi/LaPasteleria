const { z } = require("zod");

const gastoSchema = z.object({
    nombre: z.string().trim().min(1, "El nombre del gasto es obligatorio"),
    costo: z.number().positive("El costo debe ser un número mayor a 0"),
    fechaGasto: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha debe tener formato AAAA-MM-DD")
        .refine((valor) => {
            const fecha = new Date(valor);
            return !isNaN(fecha.getTime()) && fecha.toISOString().slice(0, 10) === valor;
        }, "La fecha no es válida")
    .transform((valor) => new Date(valor)),
    sucursalId: z.number().int("La sucursal es obligatoria").positive("La sucursal es obligatoria")
});


module.exports = { gastoSchema };
