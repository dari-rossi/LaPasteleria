const API_URL = "http://localhost:3000/gastos";

const obtenerMensajeError = (datos) => {
    return datos.detalles
        ? datos.detalles.map((detalle) => detalle.message).join(". ")
        : datos.error;
};

const enviar = async (url, metodo, cuerpo) => {
    const response = await fetch(url, {
        method: metodo,
        headers: {"Content-Type": "application/json"},
        body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo)
    });

    const datos = await response.json();

    if (!response.ok) {
        throw new Error(obtenerMensajeError(datos));
    }
    return datos;
};

// Los dos filtros son opcionales y se pueden combinar
export const obtenerGastos = async ({ nombre = "", sucursalId = "" } = {}) => {
    const parametros = new URLSearchParams();

    if (nombre) {
        parametros.append("nombre", nombre);
    }

    if (sucursalId) {
        parametros.append("sucursalId", sucursalId);
    }

    const consulta = parametros.toString();
    const response = await fetch(consulta ? `${API_URL}?${consulta}` : API_URL);

    if (!response.ok) {
        throw new Error("No se pudieron obtener los gastos");
    }

    return await response.json();
};

export const crearGasto = (gasto) => enviar(API_URL, "POST", gasto);

export const modificarGasto = (id, gasto) => enviar(`${API_URL}/${id}`, "PUT", gasto);

export const eliminarGasto = (id) => enviar(`${API_URL}/${id}`, "DELETE");
