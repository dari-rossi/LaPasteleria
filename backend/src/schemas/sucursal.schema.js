const { z } = require("zod");

const sucursalSchema = z.object({
    telefono: z.string().trim().min(1, "El teléfono es obligatorio").regex(/^[0-9]{10}$/, "El teléfono debe tener 10 dígitos"),
    direccion: z.string().min(1, "La dirección es obligatoria"),
    codigoPostal: z.string().min(1, "El código postal es obligatorio").regex(/^[0-9]{4}$/, "El código postal debe tener 4 dígitos"),
    horarios: z.string().min(1, "Los horarios son obligatorios")
});

module.exports = {sucursalSchema};