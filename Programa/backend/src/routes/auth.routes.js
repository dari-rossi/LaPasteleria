const { autenticar } = require("../middlewares/auth.middleware");
const express = require("express");
const { iniciarSesion } = require("../controllers/auth.controller");
const { loginSchema } = require("../schemas/auth.schema");

const router = express.Router();
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuario
 *               - contrasenia
 *             properties:
 *               usuario:
 *                 type: string
 *               contrasenia:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: Usuario o contraseña incorrectos
 */
router.post("/login", (req, res, next) => {
    const resultado = loginSchema.safeParse(req.body);

    if (!resultado.success) {
        return res.status(400).json({
            mensaje: "Datos inválidos",
            errores: resultado.error.issues.map(error => ({
                campo: error.path.join("."),
                mensaje: error.message
            }))
        });
    }

    req.body = resultado.data;
    next();
}, iniciarSesion);

/**
 * @swagger
 * /auth/perfil:
 *   get:
 *     summary: Consultar el perfil del usuario autenticado
 *     tags: [Autenticación]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sesión válida
 *       401:
 *         description: Token ausente o inválido
 */
router.get("/perfil", autenticar, (req, res) => {
    return res.status(200).json({
        mensaje: "Sesión válida",
        usuario: req.usuario
    });
});

module.exports = router;