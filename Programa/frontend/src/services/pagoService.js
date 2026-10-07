const API_URL = "http://localhost:3000/pagos";

export const obtenerPagos = async () => {
    const response = await fetch(API_URL);

    const datos = await response.json();

    if (!response.ok) {
        throw new Error(
            datos.detalles
                ? datos.detalles.map((detalle) => detalle.message).join(". ")
                : datos.error
        );
    }

    return datos;
};

export const crearPago = async (pago) => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(pago)
    });

    const datos = await response.json();

    if (!response.ok) {
        throw new Error(
            datos.detalles
                ? datos.detalles.map((detalle) => detalle.message).join(". ")
                : datos.error
        );
    }

    return datos;
};