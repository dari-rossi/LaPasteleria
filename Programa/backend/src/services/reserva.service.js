const reservaRepository = require("../repositories/reserva.repository");

// Obtener todas las reservas
const obtenerReservas = async () => {
    return await reservaRepository.obtenerTodos();
};

// Obtener una reserva por su clave compuesta (mesa + fecha y hora)
const obtenerReservaPorId = async (idMesa, fechaHora) => {
    return await reservaRepository.obtenerPorId(idMesa, fechaHora);
};

// Crear una reserva (dejo un espacio por si más adelante fuese necesario validar acá que la mesa exista, que no haya solapamiento o que cantComensales no supere maxComensales)
const crearReserva = async (datos) => {

    return await reservaRepository.crear(datos);
};

// Modificar una reserva (la clave idMesa + fechaHora no se modifica)
const modificarReserva = async (idMesa, fechaHora, datos) => {

    return await reservaRepository.modificar(idMesa, fechaHora, datos);
};

// Eliminar una reserva
const eliminarReserva = async (idMesa, fechaHora) => {
    return await reservaRepository.eliminar(idMesa, fechaHora);
};

module.exports = {
    obtenerReservas,
    obtenerReservaPorId,
    crearReserva,
    modificarReserva,
    eliminarReserva
};