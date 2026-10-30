const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export const apiFetch = async (ruta, opciones = {}) => {
    const sesion = JSON.parse(localStorage.getItem("sesion"));
    const token = sesion?.token;

    const sucursalElegida = localStorage.getItem("sucursalId");

    // Solo se agrega si la ruta todavía no trae sucursalId
    if (sucursalElegida && !/[?&]sucursalId=/.test(ruta)) {
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