const mesaRepository = require("../repositories/mesa.repository");

const { MARGEN_RESERVA_MS } = require("../config/reservas");

const obtenerMesas = async () => {
    const ahora = new Date();
    const desde = new Date(ahora.getTime() - MARGEN_RESERVA_MS);
    const hasta = new Date(ahora.getTime() + MARGEN_RESERVA_MS);

    const mesas = await mesaRepository.obtenerTodasConReservaVigente(desde, hasta);

    // Solo una mesa libre se muestra como reservada; si está ocupada, sigue ocupada
    return mesas.map(({ reservas, ...mesa }) => ({
        ...mesa,
        estado: mesa.estado === "Libre" && reservas.length > 0 ? "Reservada" : mesa.estado
    }));
};

// Obtener una mesa por ID
const obtenerMesaPorId = async (id) => {
    return await mesaRepository.obtenerPorId(id);
};

// Crear una mesa
const crearMesa = async (datos) => {
    return await mesaRepository.crear(datos);
};

// Modificar una mesa
const modificarMesa = async (id, datos) => {
    return await mesaRepository.modificar(id, datos);
};

// Eliminar una mesa
const eliminarMesa = async (id) => {
    return await mesaRepository.eliminar(id);
};

module.exports = {
    obtenerMesas,
    obtenerMesaPorId,
    crearMesa,
    modificarMesa,
    eliminarMesa
};