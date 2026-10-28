require("dotenv").config();
const jwt = require("jsonwebtoken");
const { lanzarError } = require("../config/errores");

const autenticar = (req, res, next) => {
    const autorizacion = req.headers.authorization;

    if (!autorizacion || !autorizacion.startsWith("Bearer ")) {
        lanzarError("SESION_REQUERIDA");
    }

    const token = autorizacion.split(" ")[1];
    let contenido;

    try {
        contenido = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
        lanzarError("TOKEN_INVALIDO");
    }

    if (!contenido.sub || !contenido.rol) {
        lanzarError("TOKEN_INVALIDO");
    }

    req.usuario = {
        id: contenido.sub,
        rol: contenido.rol,
        sucursalId: contenido.sucursalId ?? null
    };

    next();
};

const permitirRoles = (...rolesPermitidos) => {
    return (req, res, next) => {
        if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
            lanzarError("SIN_PERMISOS");
        }

        next();
    };
};

const verificarSucursal = (req, res, next) => {
    if (req.usuario.rol === "DUENIO") {
        return next();
    }

    const sucursalSolicitada = Number(
        req.params.sucursalId ?? req.body.sucursalId ?? req.query.sucursalId
    );

    if (!Number.isInteger(sucursalSolicitada) ||
        sucursalSolicitada !== req.usuario.sucursalId) {
        lanzarError("SUCURSAL_NO_PERMITIDA");
    }

    next();
};

module.exports = { autenticar, permitirRoles, verificarSucursal };