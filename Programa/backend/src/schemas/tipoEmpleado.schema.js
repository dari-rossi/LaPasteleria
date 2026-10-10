const { z } = require("zod");

const vacioAUndefined = (valor) => (typeof valor === "string" && valor.trim() === "" ? undefined : valor);

const tipoEmpleadoSchema = z.object({
    tipoEmpleado: z.string().trim().min(1, "El tipo de empleado es obligatorio"),
    sueldo: z.number().positive("El sueldo debe ser un número mayor a 0"),
    usuario: z.preprocess(vacioAUndefined,
         z.string().trim().toLowerCase()
            .regex(/^[a-z0-9._-]{3,30}$/, "El usuario debe tener entre 3 y 30 caracteres: letras, números, punto, guion o guion bajo")
            .optional()),
    contrasenia: z.preprocess(vacioAUndefined,
        z.string().min(8, "La contraseña debe tener al menos 8 caracteres").optional())
});

module.exports = { tipoEmpleadoSchema };