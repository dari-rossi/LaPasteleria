const { autenticar, permitirRoles } = require("../middlewares/auth.middleware");
const express = require("express");

const {
    obtenerClientes,
    obtenerClientePorId,
    crearCliente,
    modificarCliente,
    eliminarCliente
} = require("../controllers/cliente.controller");

const validate = require("../middlewares/validate");
const { clienteSchema } = require("../schemas/cliente.schema");

const router = express.Router();

const TODOS_LOS_ROLES = ["DUENIO", "GERENTE", "MOZO", "AYUDANTE_COCINA"];

/**
 * @swagger
 * /clientes:
 *   get:
 *     summary: Obtener todas las categorías de clientes
 *     tags: [Cliente]
 *     responses:
 *       200:
 *         description: Lista de categorías y descuentos
 */
router.get("/", autenticar, permitirRoles(...TODOS_LOS_ROLES), obtenerClientes);

/**
 * @swagger
 * /clientes/{id}:
 *   get:
 *     summary: Obtener una categoría por ID
 *     tags: [Cliente]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Categoría encontrada
 *       404:
 *         description: Categoría no encontrada
 */
router.get("/:id", autenticar, permitirRoles(...TODOS_LOS_ROLES), obtenerClientePorId);

/**
 * @swagger
 * /clientes:
 *   post:
 *     summary: Crear una categoría de cliente
 *     tags: [Cliente]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tipo
 *               - descuento
 *             properties:
 *               tipo:
 *                 type: string
 *                 example: Docente
 *               descuento:
 *                 type: integer
 *                 example: 25
 *     responses:
 *       201:
 *         description: Categoría creada
 *       400:
 *         description: Datos inválidos
 *       409:
 *         description: Ya existe una categoría con ese nombre
 */
router.post("/", autenticar, permitirRoles("DUENIO"), validate(clienteSchema), crearCliente);

/**
 * @swagger
 * /clientes/{id}:
 *   put:
 *     summary: Modificar una categoría de cliente
 *     tags: [Cliente]
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
 *               - tipo
 *               - descuento
 *             properties:
 *               tipo:
 *                 type: string
 *               descuento:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Categoría modificada
 *       404:
 *         description: Categoría no encontrada
 *       409:
 *         description: Ya existe una categoría con ese nombre
 */
router.put("/:id", autenticar, permitirRoles("DUENIO"), validate(clienteSchema), modificarCliente);

/**
 * @swagger
 * /clientes/{id}:
 *   delete:
 *     summary: Eliminar una categoría de cliente
 *     tags: [Cliente]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Categoría eliminada
 *       404:
 *         description: Categoría no encontrada
 */
router.delete("/:id", autenticar, permitirRoles("DUENIO"), eliminarCliente);

module.exports = router;