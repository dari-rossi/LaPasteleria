const normalizar = (texto) =>
    texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").trim().toLowerCase();

const DUENIO = "Dueño";

const TIPOS_PERMITIDOS = ["Gerente", "Mozo", "Ayudante de cocina"];

const esDuenio = (nombre) => normalizar(nombre) === normalizar(DUENIO);

const nombreOficial = (nombre) =>
    TIPOS_PERMITIDOS.find((tipo) => normalizar(tipo) === normalizar(nombre));


module.exports = { DUENIO, TIPOS_PERMITIDOS, esDuenio, nombreOficial };
