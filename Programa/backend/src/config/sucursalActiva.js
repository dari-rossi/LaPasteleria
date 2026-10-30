const { lanzarError } = require("./errores");

// Gerente y mozo: siempre la de su cuenta. Dueño: la que eligió (?sucursalId=)
const resolverSucursal = (usuario, sucursalIdElegida) => {
    if (usuario.rol !== "DUENIO") {
        return Number(usuario.sucursalId);
    }

    const id = Number(sucursalIdElegida);

    if (!Number.isInteger(id) || id <= 0) {
        lanzarError("Elegí una sucursal.", 400);
    }

    return id;
};

// El dueño accede a todas; los demás solo a la suya
const puedeAcceder = (usuario, sucursalId) =>
    usuario.rol === "DUENIO" || Number(usuario.sucursalId) === Number(sucursalId);

module.exports = { resolverSucursal, puedeAcceder };