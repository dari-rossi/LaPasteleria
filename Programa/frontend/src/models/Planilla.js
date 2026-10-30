const ZONA = "America/Argentina/Buenos_Aires";

// Devuelve la fecha actual de Argentina en formato AAAA-MM-DD.
export const hoyArgentina = () => {
    const partes = new Intl.DateTimeFormat("en-CA", {
        timeZone: ZONA,
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).formatToParts(new Date());

    const obtener = (tipo) =>
        partes.find((parte) => parte.type === tipo)?.value;

    return `${obtener("year")}-${obtener("month")}-${obtener("day")}`;
};

// Devuelve el mes actual de Argentina en formato AAAA-MM.
export const mesActualArgentina = () =>
    hoyArgentina().slice(0, 7);

// 12892.01 -> "12.892,01"
export const formatearMonto = (valor) =>
    Number(valor ?? 0).toLocaleString("es-AR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

// 12 -> "0012"
export const formatearId = (id) =>
    String(id).padStart(4, "0");

// "2026-08" -> "08/2026"
export const formatearMes = (mes) => {
    if (!mes) {
        return "—";
    }

    const [anio, numero] = mes.split("-");

    return `${numero}/${anio}`;
};