import { apiFetch } from "./api";

const pedir = async (ruta) => {
    const response = await apiFetch(ruta);
    const datos = await response.json();

    if (!response.ok) {
        throw new Error(datos.error ?? "No se pudo obtener la planilla.");
    }

    return datos;
};

export const obtenerPlanillaDiaria = (fecha) => {
    const parametros = new URLSearchParams();

    if (fecha) {
        parametros.set("fecha", fecha);
    }

    return pedir(`/planillas/diaria?${parametros.toString()}`);
};

export const obtenerPlanillaMensual = (mes) => {
    const parametros = new URLSearchParams();

    if (mes) {
        parametros.set("mes", mes);
    }

    return pedir(`/planillas/mensual?${parametros.toString()}`);
};

export const obtenerPlanillaGeneral = () =>
    pedir("/planillas/general");