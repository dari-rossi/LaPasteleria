const mesaRepository = require("../repositories/mesa.repository");
const sucursalRepository = require("../repositories/sucursal.repository");
const { MARGEN_RESERVA_MS } = require("../config/reservas");
const { lanzarError } = require("../config/errores");
const { resolverSucursal, puedeAcceder } = require("../config/sucursalActiva");

const buscarMesa = async (id, usuario) => {
    const mesa = await mesaRepository.obtenerPorId(id);

    if (!mesa) {
        lanzarError("MESA_NO_ENCONTRADA");
    }

    if (!puedeAcceder(usuario, mesa.sucursalId)) {
        lanzarError("OTRA_SUCURSAL");
    }

    return mesa;
};

const obtenerMesas = async (usuario, sucursalIdElegida) => {
    const sucursalId = resolverSucursal(usuario, sucursalIdElegida);
    const ahora = new Date();
    const desde = new Date(ahora.getTime() - MARGEN_RESERVA_MS);
    const hasta = new Date(ahora.getTime() + MARGEN_RESERVA_MS);

    const mesas = await mesaRepository.obtenerTodasConReservaVigente(desde, hasta, sucursalId);
    
    return mesas.map(({ reservas, ...mesa }) => {
        const reservada = mesa.estado === "Libre" && reservas.length > 0;

        return {
            ...mesa,
            estado: reservada ? "Reservada" : mesa.estado,
            reserva: reservada ? reservas[0] : null
        };
    });
};

const obtenerMesaPorId = async (id, usuario) => buscarMesa(id, usuario);

// La sucursal nunca se toma del body: sale del usuario o de la elegida por el dueño
const crearMesa = async (datos, usuario, sucursalIdElegida) => {
    const sucursalId = resolverSucursal(usuario, sucursalIdElegida);
    const sucursal = await sucursalRepository.obtenerPorId(sucursalId);

    if (!sucursal) {
        lanzarError("SUCURSAL_NO_ENCONTRADA");
    }

    return await mesaRepository.crear({ ...datos, sucursalId });
};

const modificarMesa = async (id, datos, usuario) => {
    await buscarMesa(id, usuario);
    return await mesaRepository.modificar(id, datos);
};

const eliminarMesa = async (id, usuario) => {
    await buscarMesa(id, usuario);
    return await mesaRepository.eliminar(id);
};

module.exports = {
    obtenerMesas,
    obtenerMesaPorId,
    crearMesa,
    modificarMesa,
    eliminarMesa
};