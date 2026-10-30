import { apiFetch } from "./api";

const pedir = async (ruta) => {
    const response = await apiFetch(ruta);
    const datos = await response.json();

    if (!response.ok) {
        throw new Error(datos.error ?? "No se pudo obtener la planilla");
    }

    return datos;
};

export const obtenerPlanillaDiaria = (fecha) =>
    pedir(`/planillas/diaria?fecha=${fecha}`);

export const obtenerPlanillaMensual = (mes) =>
    pedir(`/planillas/mensual?mes=${mes}`);

export const obtenerPlanillaGeneral = () =>
    pedir("/planillas/general");