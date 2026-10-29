const reservaRepository = require("../repositories/reserva.repository");
const mesaRepository = require("../repositories/mesa.repository");
const { lanzarError } = require("../config/errores");

// Busca una reserva por su clave compuesta (mesa + fecha y hora) o lanza 404
const buscarReserva = async (idMesa, fechaHora) => {
    const reserva = await reservaRepository.obtenerPorId(idMesa, fechaHora);

    if (!reserva) {
        lanzarError("RESERVA_NO_ENCONTRADA");
    }

    return reserva;
};

const obtenerReservas = async () => {
    return await reservaRepository.obtenerTodos();
};

const obtenerReservaPorId = async (idMesa, fechaHora) => {
    return await buscarReserva(idMesa, fechaHora);
};

// Más adelante se puede validar acá que no haya solapamiento o que cantComensales no supere maxComensales
const crearReserva = async (datos) => {
    const mesa = await mesaRepository.obtenerPorId(datos.idMesa);

    if (!mesa) {
        lanzarError("MESA_NO_ENCONTRADA");
    }

    // Si ya hay una reserva para esa mesa y hora, Prisma avisa (P2002) y se traduce a RESERVA_DUPLICADA
    return await reservaRepository.crear(datos);
};

// La clave idMesa + fechaHora no se modifica
const modificarReserva = async (idMesa, fechaHora, datos) => {
    await buscarReserva(idMesa, fechaHora);

    return await reservaRepository.modificar(idMesa, fechaHora, datos);
};

const eliminarReserva = async (idMesa, fechaHora) => {
    await buscarReserva(idMesa, fechaHora);

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