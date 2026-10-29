const reservaRepository = require("../repositories/reserva.repository");
const { MARGEN_RESERVA_MS } = require("../config/reservas");

const obtenerReservas = async () => {
    return await reservaRepository.obtenerTodos();
};

const obtenerReservaPorId = async (idMesa, fechaHora) => {
    return await reservaRepository.obtenerPorId(idMesa, fechaHora);
};

const crearReserva = async (datos) => {

    return await reservaRepository.crear(datos);
};

const modificarReserva = async (idMesa, fechaHora, datos) => {

    return await reservaRepository.modificar(idMesa, fechaHora, datos);
};

const eliminarReserva = async (idMesa, fechaHora) => {
    return await reservaRepository.eliminar(idMesa, fechaHora);
};

const cancelarReservasVencidas = async () => {
    const limite = new Date(Date.now() - MARGEN_RESERVA_MS);

    return await reservaRepository.cancelarVencidas(limite);
};

module.exports = {
    obtenerReservas,
    obtenerReservaPorId,
    crearReserva,
    modificarReserva,
    eliminarReserva,
    cancelarReservasVencidas
};