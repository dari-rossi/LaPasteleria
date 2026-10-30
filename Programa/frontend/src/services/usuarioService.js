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

export const obtenerUsuarios = async () => {
    const response = await apiFetch("/usuarios");

    if (!response.ok) {
        throw new Error("No se pudieron obtener los usuarios.");
    }

    return await response.json();
};

export const crearUsuario = (datos) =>
    enviar("/usuarios", "POST", datos);

export const modificarUsuario = (id, datos) =>
    enviar(`/usuarios/${id}`, "PUT", datos);

export const eliminarUsuario = (id) =>
    enviar(`/usuarios/${id}`, "DELETE");