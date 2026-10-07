const express = require("express");

const {
    obtenerMesas,
    obtenerMesaPorId,
    crearMesa,
    modificarMesa,
    eliminarMesa
} = require("../controllers/mesa.controller");

const validate = require("../middlewares/validate");
const { mesaSchema } = require("../schemas/mesa.schema");

const router = express.Router();

/**
 * @swagger
 * /mesas:
 *   get:
 *     summary: Obtener todas las mesas
 *     tags: [Mesa]
 *     responses:
 *       200:
 *         description: Lista de mesas
 */
router.get("/", obtenerMesas);

/**
 * @swagger
 * /mesas/{id}:
 *   get:
 *     summary: Obtener una mesa por ID
 *     tags: [Mesa]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Mesa encontrada
 *       404:
 *         description: Mesa no encontrada
 */
router.get("/:id", obtenerMesaPorId);

/**
 * @swagger
 * /mesas:
 *   post:
 *     summary: Crear una mesa
 *     tags: [Mesa]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - estado
 *               - maxComensales
 *             properties:
 *               estado:
 *                 type: string
 *                 enum: [Libre, Ocupada, Reservada]
 *                 example: Libre
 *               maxComensales:
 *                 type: integer
 *                 example: 4
 *     responses:
 *       201:
 *         description: Mesa creada
 *       400:
 *         description: Datos inválidos
 */
router.post("/", validate(mesaSchema), crearMesa);

/**
 * @swagger
 * /mesas/{id}:
 *   put:
 *     summary: Modificar una mesa
 *     tags: [Mesa]
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
 *               - estado
 *               - maxComensales
 *             properties:
 *               estado:
 *                 type: string
 *                 enum: [Libre, Ocupada, Reservada]
 *                 example: Ocupada
 *               maxComensales:
 *                 type: integer
 *                 example: 6
 *     responses:
 *       200:
 *         description: Mesa modificada
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Mesa no encontrada
 */
router.put("/:id", validate(mesaSchema), modificarMesa);

/**
 * @swagger
 * /mesas/{id}:
 *   delete:
 *     summary: Eliminar una mesa
 *     tags: [Mesa]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Mesa eliminada
 *       404:
 *         description: Mesa no encontrada
 */
router.delete("/:id", eliminarMesa);

module.exports = router;