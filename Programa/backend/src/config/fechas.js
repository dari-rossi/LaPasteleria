const { lanzarError } = require("./errores");

const ZONA = "America/Argentina/Buenos_Aires";

const DESFASE = "-03:00";
const UN_DIA_MS = 24 * 60 * 60 * 1000;

const FECHA_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const MES_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/;

const formatoFecha = new Intl.DateTimeFormat("en-CA", {
    timeZone: ZONA,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
});

// Día de hoy en Argentina, con formato AAAA-MM-DD
const hoy = (ahora = new Date()) => formatoFecha.format(ahora);

// Mes actual en Argentina, con formato AAAA-MM
const mesActual = (ahora = new Date()) => hoy(ahora).slice(0, 7);

const rangoDelDia = (fecha) => {
    if (!FECHA_REGEX.test(fecha)) {
        lanzarError("FECHA_INVALIDA");
    }

    const desde = new Date(`${fecha}T00:00:00${DESFASE}`);

    if (isNaN(desde.getTime()) || hoy(desde) !== fecha) {
        lanzarError("FECHA_INVALIDA");
    }

    if (fecha > hoy()) {
        lanzarError("FECHA_FUTURA");
    }

    return { desde, hasta: new Date(desde.getTime() + UN_DIA_MS) };
};

const rangoDelMes = (mes) => {
    if (!MES_REGEX.test(mes)) {
        lanzarError("MES_INVALIDO");
    }

    if (mes > mesActual()) {
        lanzarError("MES_FUTURO");
    }

    const [anio, numero] = mes.split("-").map(Number);
    const siguiente = numero === 12
        ? `${anio + 1}-01`
        : `${anio}-${String(numero + 1).padStart(2, "0")}`;

    return {
        desde: new Date(`${mes}-01T00:00:00${DESFASE}`),
        hasta: new Date(`${siguiente}-01T00:00:00${DESFASE}`)
    };
};

module.exports = { hoy, mesActual, rangoDelDia, rangoDelMes };