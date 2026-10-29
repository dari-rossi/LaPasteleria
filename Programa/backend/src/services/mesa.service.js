const mesaRepository = require("../repositories/mesa.repository");
const sucursalRepository = require("../repositories/sucursal.repository");
const { lanzarError } = require("../config/errores");

// Busca una mesa o lanza 404
const buscarMesa = async (id) => {
    const mesa = await mesaRepository.obtenerPorId(id);

    if (!mesa) {
        lanzarError("MESA_NO_ENCONTRADA");
    }

    return mesa;
};

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

const obtenerMesaPorId = async (id) => {
    return await buscarMesa(id);
};

const crearMesa = async (datos) => {
    const sucursal = await sucursalRepository.obtenerPorId(datos.sucursalId);

    if (!sucursal) {
        lanzarError("SUCURSAL_NO_ENCONTRADA");
    }

    return await mesaRepository.crear(datos);
};

const modificarMesa = async (id, datos) => {
    await buscarMesa(id);

    return await mesaRepository.modificar(id, datos);
};

const eliminarMesa = async (id) => {
    await buscarMesa(id);

    return await mesaRepository.eliminar(id);
};

module.exports = {
    obtenerMesas,
    obtenerMesaPorId,
    crearMesa,
    modificarMesa,
    eliminarMesa
};