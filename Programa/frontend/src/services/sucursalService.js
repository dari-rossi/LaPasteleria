import { apiFetch } from "./api";

const obtenerMensajeError = (datos) => {
    return datos.detalles
        ? datos.detalles.map((detalle) => detalle.message).join(". ")
        : datos.error;
};

export const obtenerSucursales = async () => {
    const response = await apiFetch("/sucursales");

    if (!response.ok) {
        throw new Error("No se pudieron obtener las sucursales");
    }

    return await response.json();
};

export const obtenerSucursalPorId = async (id) => {
    const response = await apiFetch(`/sucursales/${id}`);

    if (!response.ok) {
        throw new Error("No se pudo obtener la sucursal");
    }

    return await response.json();
};

export const crearSucursal = async (sucursal) => {
    const response = await apiFetch("/sucursales", {
        method: "POST",
        body: JSON.stringify(sucursal)
    });

    const datos = await response.json();

    if (!response.ok) {
        throw new Error(obtenerMensajeError(datos));
    }

    return datos;
};

export const modificarSucursal = async (id, sucursal) => {
    const response = await apiFetch(`/sucursales/${id}`, {
        method: "PUT",
        body: JSON.stringify(sucursal)
    });

    const datos = await response.json();

    if (!response.ok) {
        throw new Error(obtenerMensajeError(datos));
    }

    return datos;
};

export const eliminarSucursal = async (id) => {
    const response = await apiFetch(`/sucursales/${id}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        throw new Error("No se pudo eliminar la sucursal");
    }

    return await response.json();
};