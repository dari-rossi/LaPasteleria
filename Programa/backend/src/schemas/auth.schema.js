const { z } = require("zod");

const loginSchema = z.object({
    nombreUsuario: z.string().trim().toLowerCase().min(1, "El usuario es obligatorio"),
    contrasenia: z.string().min(1, "La contraseña es obligatoria")
});

module.exports = { loginSchema };