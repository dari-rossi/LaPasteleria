import { apiFetch } from "./api";

const obtenerMensajeError = (datos) => {
    return datos.detalles
        ? datos.detalles.map((detalle) => detalle.message).join(". ")
        : datos.error;
};

const enviar = async (ruta, metodo, cuerpo) => {
    const response = await apiFetch(ruta, {
        method: metodo,
        body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo)
    });

    const datos = await response.json();

    if (!response.ok) {
        throw new Error(obtenerMensajeError(datos));
    }

    return datos;
};

// Los dos filtros son opcionales y se pueden combinar
export const obtenerGastos = async ({ nombre = "" } = {}) => {
    const parametros = new URLSearchParams();

    if (nombre) {
        parametros.append("nombre", nombre);
    }

    const consulta = parametros.toString();
    const ruta = consulta ? `/gastos?${consulta}` : "/gastos";
    const response = await apiFetch(ruta);

    if (!response.ok) {
        throw new Error("No se pudieron obtener los gastos");
    }

    return await response.json();
};

export const crearGasto = (gasto) =>
    enviar("/gastos", "POST", gasto);

export const modificarGasto = (id, gasto) =>
    enviar(`/gastos/${id}`, "PUT", gasto);

export const eliminarGasto = (id) =>
    enviar(`/gastos/${id}`, "DELETE");