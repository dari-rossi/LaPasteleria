const authService = require("../services/auth.service");

const iniciarSesion = async (req, res) => {
    const resultado = await authService.login(req.body);
    res.status(200).json(resultado);
};

module.exports = { iniciarSesion };