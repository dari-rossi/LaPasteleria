require("dotenv").config();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const usuarioRepository = require("../repositories/usuario.repository");
const { esDuenio } = require("../config/tiposEmpleado");
const { lanzarError } = require("../config/errores");

const login = async ({ nombreUsuario, contrasenia }) => {
    const usuario = await usuarioRepository.obtenerPorNombre(nombreUsuario);

    if (!usuario) {
        lanzarError("CREDENCIALES_INVALIDAS");
    }

    const contraseniaValida = await bcrypt.compare(contrasenia, usuario.contrasenia);

    if (!contraseniaValida) {
        lanzarError("CREDENCIALES_INVALIDAS");
    }

    const rol = usuario.tipoEmpleado.rol;

    // El Dueño no tiene sucursal; todos los demás sí
    if (esDuenio(rol) !== (usuario.sucursalId === null)) {
        lanzarError("CUENTA_CONFIGURACION_INVALIDA");
    }

    if (!process.env.JWT_SECRET) {
        lanzarError("JWT_SECRET_FALTANTE");
    }

    const token = jwt.sign(
        {
            sub: usuario.idUsuario,
            rol: rol,
            sucursalId: usuario.sucursalId
        },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
    );

    return {
        token,
        nombreUsuario: usuario.nombreUsuario,
        rol: rol,
        sucursalId: usuario.sucursalId
    };
};

module.exports = { login };