export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const apiFetch = async (ruta, opciones = {}) => {
    const sesion = JSON.parse(localStorage.getItem("sesion"));
    const token = sesion?.token;

    return await fetch(`${API_URL}${ruta}`, {
        ...opciones,
        headers: {
            ...(opciones.body ? { "Content-Type": "application/json" } : {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...opciones.headers
        }
    });
};