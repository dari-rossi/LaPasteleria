const { z } = require("zod");

const sueldoSchema = z.number().positive("El sueldo debe ser un número mayor a 0");

const modificarTipoEmpleadoSchema = z.object({
    sueldo: sueldoSchema
});

module.exports = { modificarTipoEmpleadoSchema };