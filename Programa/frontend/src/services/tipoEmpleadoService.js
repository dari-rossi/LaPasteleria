const API_URL = "http://localhost:3000/tipos-empleado";

const obtenerMensajeError = (datos) => {
    return datos.detalles
        ? datos.detalles.map((detalle) => detalle.message).join(". ")
        : datos.error;
};

// POST, PUT y DELETE comparten la misma forma de pedir y de leer los errores
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

export const obtenerTiposEmpleado = async (tipoEmpleado = "") => {
    const url = tipoEmpleado
        ? `${API_URL}?tipoEmpleado=${encodeURIComponent(tipoEmpleado)}`
        : API_URL;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("No se pudieron obtener los tipos de empleado");
    }

    return await response.json();
};

export const crearTipoEmpleado = (tipo) => enviar(API_URL, "POST", tipo);

export const modificarTipoEmpleado = (id, tipo) => enviar(`${API_URL}/${id}`, "PUT", tipo);

export const eliminarTipoEmpleado = (id) => enviar(`${API_URL}/${id}`, "DELETE");
