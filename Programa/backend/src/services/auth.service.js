require("dotenv").config();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../prisma");

const login = async ({ usuario, contrasenia }) => {
    const cuenta = await prisma.cuentaAcceso.findUnique({
        where: { usuario: usuario.trim() }
    });

    if (!cuenta) {
        throw new Error("Credenciales inválidas");
    }

    const contraseniaValida = await bcrypt.compare(
        contrasenia,
        cuenta.contraseniaHash
    );

    if (!contraseniaValida) {
        throw new Error("Credenciales inválidas");
    }

    if (cuenta.rol === "DUENIO" && cuenta.sucursalId !== null) {
        throw new Error("Configuración de cuenta inválida");
    }

    if (cuenta.rol !== "DUENIO" && cuenta.sucursalId === null) {
        throw new Error("Configuración de cuenta inválida");
    }

    if (!process.env.JWT_SECRET) {
        throw new Error("Falta configurar JWT_SECRET");
    }

    const token = jwt.sign(
        {
            sub: cuenta.id,
            rol: cuenta.rol,
            sucursalId: cuenta.sucursalId
        },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
    );

    return {
        token,
        usuario: cuenta.usuario,
        rol: cuenta.rol,
        sucursalId: cuenta.sucursalId
    };
};

module.exports = { login };
