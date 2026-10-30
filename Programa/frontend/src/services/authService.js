import { API_URL } from "./api";

export const iniciarSesion = async (nombreUsuario, contrasenia) => {
    const respuesta = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ nombreUsuario, contrasenia })
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(datos.error || "No se pudo iniciar sesión");
    }

    return datos;
};