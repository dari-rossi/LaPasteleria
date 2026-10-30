const reservaService = require("../services/reserva.service");
const { leerId, lanzarError } = require("../config/errores");

const leerClave = (params) => {
    const idMesa = leerId(params.idMesa, "RESERVA_CLAVE_INCORRECTA");
    const fechaHora = new Date(params.fechaHora);

    if (isNaN(fechaHora.getTime())) {
        lanzarError("RESERVA_CLAVE_INCORRECTA");
    }

    return { idMesa, fechaHora };
};

const obtenerReservas = async (req, res) => {
<<<<<<< HEAD
    const reservas = await reservaService.obtenerReservas(req.usuario, req.query.sucursalId);
=======
    const sucursalId = req.query.sucursalId ? Number(req.query.sucursalId) : null;
    const reservas = await reservaService.obtenerReservas(req.usuario, sucursalId);
>>>>>>> planilla
    res.json(reservas);
};

const obtenerReservaPorId = async (req, res) => {
    const { idMesa, fechaHora } = leerClave(req.params);
    const reserva = await reservaService.obtenerReservaPorId(idMesa, fechaHora, req.usuario);
    res.json(reserva);
};

const crearReserva = async (req, res) => {
    const reserva = await reservaService.crearReserva(req.body, req.usuario);
    res.status(201).json(reserva);
};

const modificarReserva = async (req, res) => {
    const { idMesa, fechaHora } = leerClave(req.params);
    const reserva = await reservaService.modificarReserva(idMesa, fechaHora, req.body, req.usuario);
    res.json(reserva);
};

const eliminarReserva = async (req, res) => {
    const { idMesa, fechaHora } = leerClave(req.params);
    await reservaService.eliminarReserva(idMesa, fechaHora, req.usuario);
    res.json({ mensaje: "Reserva eliminada" });
};

module.exports = {
    obtenerReservas,
    obtenerReservaPorId,
    crearReserva,
    modificarReserva,
    eliminarReserva
};