const reservaService = require("../services/reserva.service");
const { leerId, lanzarError } = require("../config/errores");

// Valida y convierte los parámetros de la clave compuesta (mesa + fecha y hora)
const leerClave = (params) => {
    const idMesa = leerId(params.idMesa, "RESERVA_CLAVE_INCORRECTA");
    const fechaHora = new Date(params.fechaHora);

    if (isNaN(fechaHora.getTime())) {
        lanzarError("RESERVA_CLAVE_INCORRECTA");
    }

    return { idMesa, fechaHora };
};

const obtenerReservas = async (req, res) => {
    const reservas = await reservaService.obtenerReservas();
    res.json(reservas);
};

const obtenerReservaPorId = async (req, res) => {
    const { idMesa, fechaHora } = leerClave(req.params);
    const reserva = await reservaService.obtenerReservaPorId(idMesa, fechaHora);
    res.json(reserva);
};

const crearReserva = async (req, res) => {
    const reserva = await reservaService.crearReserva(req.body);
    res.status(201).json(reserva);
};

const modificarReserva = async (req, res) => {
    const { idMesa, fechaHora } = leerClave(req.params);
    const reserva = await reservaService.modificarReserva(idMesa, fechaHora, req.body);
    res.json(reserva);
};

const eliminarReserva = async (req, res) => {
    const { idMesa, fechaHora } = leerClave(req.params);
    await reservaService.eliminarReserva(idMesa, fechaHora);
    res.json({ mensaje: "Reserva eliminada" });
};

module.exports = {
    obtenerReservas,
    obtenerReservaPorId,
    crearReserva,
    modificarReserva,
    eliminarReserva
};