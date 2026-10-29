const ROLES = ["DUENIO", "GERENTE", "MOZO", "AYUDANTE_COCINA"];

const esDuenio = (rol) => rol === "DUENIO";

module.exports = { ROLES, esDuenio };