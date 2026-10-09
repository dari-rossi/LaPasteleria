const reservaService = require("../services/reserva.service");

// Valida y convierte los parámetros de la clave compuesta.
// Devuelve null si alguno es inválido.
const leerClave = (params) => {
    const idMesa = Number(params.idMesa);
    const fechaHora = new Date(params.fechaHora);

    if (!Number.isInteger(idMesa) || idMesa <= 0) return null;
    if (isNaN(fechaHora.getTime())) return null;

    return { idMesa, fechaHora };
};

const obtenerReservas = async (req, res) => {
    try {
        const reservas = await reservaService.obtenerReservas();

        res.json(reservas);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error al obtener las reservas"});
    }
};

const obtenerReservaPorId = async (req, res) => {
    try {
        const clave = leerClave(req.params);
        if (!clave) {
            return res.status(400).json({error: "Mesa o fecha y hora incorrectas"});
        }

        const reserva = await reservaService.obtenerReservaPorId(clave.idMesa, clave.fechaHora);

        if (!reserva) {
            return res.status(404).json({error: "reserva no encontrada"});
        }

        res.json(reserva);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error al obtener la reserva"});
    }
};

const crearReserva = async (req, res) => {
    try {
        const reserva = await reservaService.crearReserva(req.body);

        res.status(201).json(reserva);
    } catch (error) {
        console.error(error);

        if (error.status) {
            return res.status(error.status).json({error: error.message});
        }

        // P2002: ya existe una reserva con esa mesa y fecha/hora
        if (error.code === "P2002") {
            return res.status(409).json({error: "Ya existe una reserva para esa mesa en esa fecha y hora"});
        }

        // P2003: la mesa indicada no existe (falla la clave foránea)
        if (error.code === "P2003") {
            return res.status(400).json({error: "La mesa indicada no existe"});
        }

        res.status(500).json({error: "Error al crear la reserva"});
    }
};

const modificarReserva = async (req, res) => {
    try {
        const clave = leerClave(req.params);
        if (!clave) {
            return res.status(400).json({error: "Mesa o fecha y hora incorrectas"});
        }

        const reservaExistente = await reservaService.obtenerReservaPorId(clave.idMesa, clave.fechaHora);

        if (!reservaExistente) {
            return res.status(404).json({error: "reserva no encontrada"});
        }

        const reserva = await reservaService.modificarReserva(clave.idMesa, clave.fechaHora, req.body);

        res.json(reserva);
    } catch (error) {
        console.error(error);

        if (error.status) {
            return res.status(error.status).json({error: error.message});
        }

        res.status(500).json({error: "Error al modificar la reserva"});
    }
};

const eliminarReserva = async (req, res) => {
    try {
        const clave = leerClave(req.params);
        if (!clave) {
            return res.status(400).json({error: "Mesa o fecha y hora incorrectas"});
        }

        const reservaExistente = await reservaService.obtenerReservaPorId(clave.idMesa, clave.fechaHora);

        if (!reservaExistente) {
            return res.status(404).json({error: "reserva no encontrada"});
        }

        await reservaService.eliminarReserva(clave.idMesa, clave.fechaHora);

        res.json({mensaje: "reserva eliminada"});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error al eliminar la reserva"});
    }
};

module.exports = {
    obtenerReservas,
    obtenerReservaPorId,
    crearReserva,
    modificarReserva,
    eliminarReserva
};