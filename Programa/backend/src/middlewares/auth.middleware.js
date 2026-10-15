require("dotenv").config();
const jwt = require("jsonwebtoken");

const autenticar = (req, res, next) => {
    const autorizacion = req.headers.authorization;

    if (!autorizacion || !autorizacion.startsWith("Bearer ")) {
        return res.status(401).json({mensaje: "Debés iniciar sesión para acceder"});
    }

    const token = autorizacion.split(" ")[1];

    try {
        const contenido = jwt.verify(token, process.env.JWT_SECRET);

        if (!contenido.sub || !contenido.rol) {
            return res.status(401).json({mensaje: "Token inválido"});
        }

        req.usuario = {
            id: contenido.sub,
            rol: contenido.rol,
            sucursalId: contenido.sucursalId ?? null
        };

        next();
    } catch {
        return res.status(401).json({
            mensaje: "Token inválido o vencido"
        });
    }
};

const permitirRoles = (...rolesPermitidos) => {
    return (req, res, next) => {
        if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
            return res.status(403).json({mensaje: "No tenés permisos para realizar esta operación"});
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
        return res.status(403).json({mensaje: "No tenés acceso a esta sucursal"});
    }

    next();
};

module.exports = { autenticar, permitirRoles, verificarSucursal };
