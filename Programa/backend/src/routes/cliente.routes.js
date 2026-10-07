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

/**
 * @swagger
 * /clientes:
 *   get:
 *     summary: Obtener todos los clientes
 *     tags: [Cliente]
 *     responses:
 *       200:
 *         description: Lista de clientes
 */
router.get("/", obtenerClientes);

/**
 * @swagger
 * /clientes/{id}:
 *   get:
 *     summary: Obtener un cliente por ID
 *     tags: [Cliente]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *       404:
 *         description: Cliente no encontrado
 */
router.get("/:id", obtenerClientePorId);

/**
 * @swagger
 /**
 * @swagger
 * /clientes:
 *   post:
 *     summary: Crear un cliente
 *     tags: [Cliente]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tipo
 *             properties:
 *               tipo:
 *                 type: string
 *                 enum: [General, Jubilado, Estudiante]
 *     responses:
 *       201:
 *         description: Cliente creado
 *       400:
 *         description: Datos inválidos
 */
router.post("/", validate(clienteSchema), crearCliente);

/**
 * @swagger
/**
 * @swagger
 * /clientes/{id}:
 *   put:
 *     summary: Modificar un cliente
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
 *             properties:
 *               tipo:
 *                 type: string
 *                 enum: [General, Jubilado, Estudiante]
 *     responses:
 *       200:
 *         description: Cliente modificado
 *       404:
 *         description: Cliente no encontrado
 */
router.put("/:id", validate(clienteSchema), modificarCliente);

/**
 * @swagger
 * /clientes/{id}:
 *   delete:
 *     summary: Eliminar un cliente
 *     tags: [Cliente]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cliente eliminado
 *       404:
 *         description: Cliente no encontrado
 */
router.delete("/:id", eliminarCliente);

module.exports = router;