const API_URL = "http://localhost:3000/itemProducto";

const obtenerMensajeError = (datos) => {
    return datos.detalles
        ? datos.detalles.map((detalle) => detalle.message).join(". ")
        : datos.error;
};

const enviar = async (url, metodo, cuerpo) => {
    const response = await fetch(url, {
        method: metodo,
        headers: {"Content-Type": "application/json"},
        body: cuerpo ? JSON.stringify(cuerpo) : undefined
    });

    const datos = await response.json();

    if (!response.ok) {
        throw new Error(obtenerMensajeError(datos));
    }
    return datos;
};

export const agregarItem = (item) => enviar(API_URL, "POST", item);

export const modificarCantidad = (id, cantidad) => enviar(`${API_URL}/${id}`, "PUT", {cantidad});

export const quitarItem = (id) => enviar(`${API_URL}/${id}`, "DELETE");