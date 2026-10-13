const { z } = require("zod");

const clienteSchema = z.object({
    tipo: z.string().trim().min(1, "El tipo es obligatorio")
    .refine((tipo) => ["Jubilado", "Estudiante", "General"].includes(tipo), {message: "El tipo debe ser Jubilado, Estudiante o General"})
});

module.exports = { clienteSchema };