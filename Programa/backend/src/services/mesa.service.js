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

const COLUMNAS_PLANO = 4;

const primeraCeldaLibre = (ocupadas) => {
    const usadas = new Set(ocupadas.map(({ fila, columna }) => `${fila}-${columna}`));

    for (let fila = 1; ; fila++) {
        for (let columna = 1; columna <= COLUMNAS_PLANO; columna++) {
            if (!usadas.has(`${fila}-${columna}`)) {
                return { fila, columna };
            }
        }
    }
};

const crearMesa = async (datos, usuario, sucursalIdElegida) => {
    const sucursalId = resolverSucursal(usuario, sucursalIdElegida);
    const sucursal = await sucursalRepository.obtenerPorId(sucursalId);

    if (!sucursal) {
        lanzarError("SUCURSAL_NO_ENCONTRADA");
    }

    if ((datos.fila === undefined) !== (datos.columna === undefined)) {
        lanzarError("Indicá la fila y la columna juntas, o ninguna de las dos.", 400);
    }

    const ocupadas = await mesaRepository.obtenerOcupacionPlano(sucursalId);
    const numero = ocupadas.reduce((maximo, mesa) => Math.max(maximo, mesa.numero), 0) + 1;

    const posicion = datos.fila !== undefined
        ? { fila: datos.fila, columna: datos.columna }
        : primeraCeldaLibre(ocupadas);

    return await mesaRepository.crear({ ...datos, ...posicion, numero, sucursalId });
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