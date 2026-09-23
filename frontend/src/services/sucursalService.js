const API_URL = "http://localhost:3000/sucursales";

export const obtenerSucursales = async () => {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("No se pudieron obtener las sucursales");
    }

    return await response.json();
};

export const crearSucursal = async (sucursal) => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(sucursal)
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

export const modificarSucursal = async (id, sucursal) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(sucursal)
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

export const eliminarSucursal = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {method: "DELETE"});
    if (!response.ok) {
        throw new Error("No se pudo eliminar la sucursal");
    }
    return await response.json();
};