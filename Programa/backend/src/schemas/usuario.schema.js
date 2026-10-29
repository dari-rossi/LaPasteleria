const { z } = require("zod");

const vacioAUndefined = (valor) => (typeof valor === "string" && valor.trim() === "" ? undefined : valor);

const nombreUsuarioSchema = z.string().trim().toLowerCase()
    .regex(/^[a-z0-9._-]{3,30}$/, "El usuario debe tener entre 3 y 30 caracteres: letras, números, punto, guion o guion bajo");

const contraseniaSchema = z.string().min(8, "La contraseña debe tener al menos 8 caracteres");

const datosBase = {
    nombreUsuario: nombreUsuarioSchema,
    idTipoEmpleado: z.number({ error: "El tipo de empleado es obligatorio" })
        .int("El tipo de empleado es obligatorio")
        .positive("El tipo de empleado es obligatorio"),
    // null o ausente = sin sucursal (solo válido para el Dueño; lo valida el service)
    sucursalId: z.number().int("La sucursal no es válida").positive("La sucursal no es válida").nullable().optional()
};

const crearUsuarioSchema = z.object({
    ...datosBase,
    contrasenia: contraseniaSchema
});

// Al modificar, la contraseña es opcional: si viene vacía o no viene, no se cambia
const modificarUsuarioSchema = z.object({
    ...datosBase,
    contrasenia: z.preprocess(vacioAUndefined, contraseniaSchema.optional())
});

module.exports = { crearUsuarioSchema, modificarUsuarioSchema };