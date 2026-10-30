import { apiFetch } from "./api";

const pedir = async (ruta) => {
    const response = await apiFetch(ruta);
    const datos = await response.json();

    if (!response.ok) {
        throw new Error(datos.error ?? "No se pudo obtener la planilla");
    }

    return datos;
};

export const obtenerPlanillaDiaria = (fecha, sucursalId) =>
    pedir(`/planillas/diaria?fecha=${fecha}&sucursalId=${sucursalId}`);

export const obtenerPlanillaMensual = (mes, sucursalId) =>
    pedir(`/planillas/mensual?mes=${mes}&sucursalId=${sucursalId}`);

export const obtenerPlanillaGeneral = () =>
    pedir("/planillas/general");