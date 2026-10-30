const ZONA = "America/Argentina/Buenos_Aires";

// Hoy en Argentina con formato AAAA-MM-DD (el que usa el input de tipo "date")
export const hoyArgentina = () =>
    new Date().toLocaleDateString("en-CA", { timeZone: ZONA });

// Mes actual en Argentina con formato AAAA-MM (el que usa el input de tipo "month")
export const mesActualArgentina = () => hoyArgentina().slice(0, 7);

// 12892.01 -> "12.892,01"
export const formatearMonto = (valor) =>
    valor.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// 12 -> "0012"
export const formatearId = (id) => String(id).padStart(4, "0");

// "2026-08" -> "08/2026"
export const formatearMes = (mes) => {
    const [anio, numero] = mes.split("-");

    return `${numero}/${anio}`;
};