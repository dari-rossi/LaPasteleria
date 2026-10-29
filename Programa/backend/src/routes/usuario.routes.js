const { autenticar, permitirRoles } = require("../middlewares/auth.middleware");
const express = require("express");

const {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    modificarUsuario,
    eliminarUsuario
} = require("../controllers/usuario.controller");

const validate = require("../middlewares/validate");
const { crearUsuarioSchema, modificarUsuarioSchema } = require("../schemas/usuario.schema");
const router = express.Router();

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Listar usuarios (sin contraseña), opcionalmente de una sucursal
 *     tags: [Usuario]
 *     parameters:
 *       - in: query
 *         name: sucursalId
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *       400:
 *         description: ID de sucursal incorrecto
 */
router.get("/", autenticar, permitirRoles("DUENIO"), obtenerUsuarios);

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags: [Usuario]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       400:
 *         description: ID incorrecto
 *       404:
 *         description: Usuario no encontrado
 */
router.get("/:id", autenticar, permitirRoles("DUENIO"), obtenerUsuarioPorId);

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Crear un usuario
 *     tags: [Usuario]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombreUsuario
 *               - contrasenia
 *               - idTipoEmpleado
 *             properties:
 *               nombreUsuario:
 *                 type: string
 *                 example: mozo3
 *               contrasenia:
 *                 type: string
 *                 description: Mínimo 8 caracteres
 *               idTipoEmpleado:
 *                 type: integer
 *                 example: 3
 *               sucursalId:
 *                 type: integer
 *                 nullable: true
 *                 description: Obligatoria salvo para el Dueño (que debe ir sin sucursal)
 *                 example: 1
 *     responses:
 *       201:
 *         description: Usuario creado
 *       400:
 *         description: Datos inválidos o sucursal incorrecta para el rol
 *       404:
 *         description: Tipo de empleado o sucursal no encontrados
 *       409:
 *         description: Nombre de usuario repetido o la sucursal ya tiene un usuario con ese rol
 */
router.post("/", autenticar, permitirRoles("DUENIO"), validate(crearUsuarioSchema), crearUsuario);

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Modificar un usuario
 *     tags: [Usuario]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombreUsuario
 *               - idTipoEmpleado
 *             properties:
 *               nombreUsuario:
 *                 type: string
 *               contrasenia:
 *                 type: string
 *                 description: Opcional (mínimo 8 caracteres). Si no se envía, no se modifica
 *               idTipoEmpleado:
 *                 type: integer
 *               sucursalId:
 *                 type: integer
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Usuario modificado
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Usuario, tipo de empleado o sucursal no encontrados
 *       409:
 *         description: Conflicto con otra cuenta o intento de cambiar tu propio rol
 */
router.put("/:id", autenticar, permitirRoles("DUENIO"), validate(modificarUsuarioSchema), modificarUsuario);

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Eliminar un usuario
 *     tags: [Usuario]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario eliminado
 *       404:
 *         description: Usuario no encontrado
 *       409:
 *         description: No podés eliminar tu propia cuenta
 */
router.delete("/:id", autenticar, permitirRoles("DUENIO"), eliminarUsuario);

module.exports = router;