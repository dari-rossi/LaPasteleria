const { z } = require("zod");

const reservaSchema = z.object({
    idMesa: z.number().int("El id de mesa debe ser un entero").positive("El id de mesa debe ser positivo"),
    fechaHoraReservada: z.coerce.date({ message: "La fecha y hora no son válidas" }),
    cantComensales: z.number().int("La cantidad de comensales debe ser un entero").positive("La cantidad de comensales debe ser positiva"),
    estadoReserva: z.enum(["Activa", "En curso", "Finalizada", "Cancelada"], {
    message: "El estado debe ser Activa, En curso, Finalizada o Cancelada"}),
    dni: z.string().trim().min(1, "El DNI es obligatorio")
});

// Para modificar: la clave (idMesa + fechaHoraReservada) viaja en la URL y no se puede cambiar
const reservaModificarSchema = reservaSchema.omit({
    idMesa: true,
    fechaHoraReservada: true
});

module.exports = { reservaSchema, reservaModificarSchema };