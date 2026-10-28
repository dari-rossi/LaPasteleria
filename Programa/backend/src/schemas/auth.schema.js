const { z } = require("zod");

const loginSchema = z.object({
    usuario: z.string().trim().min(1, "El usuario es obligatorio"),
    contrasenia: z.string().min(1, "La contraseña es obligatoria")
});

module.exports = { loginSchema };
