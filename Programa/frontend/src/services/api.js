const API_URL = "http://localhost:3000";

export const apiFetch = async (ruta, opciones = {}) => {
    const sesion = JSON.parse(localStorage.getItem("sesion"));
    const token = sesion?.token;
    const sucursalElegida = localStorage.getItem("sucursalId");

    if (sucursalElegida) {
        const separador = ruta.includes("?") ? "&" : "?";
        ruta = `${ruta}${separador}sucursalId=${sucursalElegida}`;
    }

    return await fetch(`${API_URL}${ruta}`, {
        ...opciones,
        headers: {
            ...(opciones.body ? { "Content-Type": "application/json" } : {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...opciones.headers
        }
    });
};