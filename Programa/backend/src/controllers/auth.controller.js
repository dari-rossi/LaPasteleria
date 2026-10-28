const authService = require("../services/auth.service");

const iniciarSesion = async (req, res) => {
    try {
        const resultado = await authService.login(req.body);
        return res.status(200).json(resultado);
    } catch (error) {
        if (error.message === "Credenciales inválidas") {
            return res.status(401).json({
                mensaje: "Usuario o contraseña incorrectos"
            });
        }

        if (error.message === "Configuración de cuenta inválida") {
            return res.status(500).json({
                mensaje: "La cuenta tiene una configuración incorrecta"
            });
        }

        console.error("Error al iniciar sesión:", error.message);
        return res.status(500).json({
            mensaje: "Error interno al iniciar sesión"
        });
    }
};

module.exports = { iniciarSesion };
