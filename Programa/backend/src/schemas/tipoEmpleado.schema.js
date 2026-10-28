const { z } = require("zod");
const { ROLES } = require("../config/tiposEmpleado");

const sueldoSchema = z.number().positive("El sueldo debe ser un número mayor a 0");

const crearTipoEmpleadoSchema = z.object({
    rol: z.enum(ROLES, { error: `El rol debe ser uno de: ${ROLES.join(", ")}` }),
    sueldo: sueldoSchema
});

const modificarTipoEmpleadoSchema = z.object({
    sueldo: sueldoSchema
});

module.exports = { crearTipoEmpleadoSchema, modificarTipoEmpleadoSchema };