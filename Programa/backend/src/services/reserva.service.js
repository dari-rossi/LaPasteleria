const reservaRepository = require("../repositories/reserva.repository");
const mesaRepository = require("../repositories/mesa.repository");
const { MARGEN_RESERVA_MS } = require("../config/reservas");
const { lanzarError } = require("../config/errores");
const { resolverSucursal, puedeAcceder } = require("../config/sucursalActiva");

const buscarReserva = async (idMesa, fechaHora, usuario) => {
    const reserva = await reservaRepository.obtenerPorId(idMesa, fechaHora);

    if (!reserva) {
        lanzarError("RESERVA_NO_ENCONTRADA");
    }

    const mesa = await mesaRepository.obtenerPorId(idMesa);

    if (!puedeAcceder(usuario, mesa.sucursalId)) {
        lanzarError("OTRA_SUCURSAL");
    }

    return reserva;
};

const obtenerReservas = async (usuario, sucursalIdElegida) => {
    return await reservaRepository.obtenerTodos(
        resolverSucursal(usuario, sucursalIdElegida)
    );
};

const obtenerReservaPorId = async (idMesa, fechaHora, usuario) => {
    return await buscarReserva(idMesa, fechaHora, usuario);
};

const crearReserva = async (datos, usuario) => {
    const mesa = await mesaRepository.obtenerPorId(datos.idMesa);

    if (!mesa) {
        lanzarError("MESA_NO_ENCONTRADA");
    }

    if (!puedeAcceder(usuario, mesa.sucursalId)) {
        lanzarError("OTRA_SUCURSAL");
    }

    const existente = await reservaRepository.obtenerPorId(
        datos.idMesa,
        new Date(datos.fechaHoraReservada)
    );

    if (existente && existente.estadoReserva === "Cancelada") {
        return await reservaRepository.modificar(datos.idMesa, existente.fechaHoraReservada, {
            cantComensales: datos.cantComensales,
            estadoReserva: datos.estadoReserva,
            dni: datos.dni
        });
    }

    return await reservaRepository.crear(datos);
};

const modificarReserva = async (idMesa, fechaHora, datos, usuario) => {
    await buscarReserva(idMesa, fechaHora, usuario);

    return await reservaRepository.modificar(idMesa, fechaHora, datos);
};

const eliminarReserva = async (idMesa, fechaHora, usuario) => {
    await buscarReserva(idMesa, fechaHora, usuario);

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