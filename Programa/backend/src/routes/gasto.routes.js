const express = require("express");

const {
    obtenerGastos,
    obtenerGastoPorId,
    crearGasto,
    modificarGasto,
    eliminarGasto
} = require("../controllers/gasto.controller");

const validate = require("../middlewares/validate");
const { gastoSchema } = require("../schemas/gasto.schema");
const router = express.Router();

/**
 * @swagger
 * /gastos:
 *   get:
 *     summary: Obtener todos los gastos (opcionalmente filtrados por sucursal)
 *     tags: [Gasto]
 *     parameters:
 *       - in: query
 *         name: sucursalId
 *         required: false
 *         schema:
 *           type: integer
 *       - in: query
 *         name: nombre
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de gastos
 *       400:
 *         description: ID de sucursal incorrecto
 */
router.get("/", obtenerGastos);

/**
 * @swagger
 * /gastos/{id}:
 *   get:
 *     summary: Obtener un gasto por ID
 *     tags: [Gasto]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Gasto encontrado
 *       400:
 *         description: ID incorrecto
 *       404:
 *         description: Gasto no encontrado
 */
router.get("/:id", obtenerGastoPorId);

/**
 * @swagger
 * /gastos:
 *   post:
 *     summary: Crear un gasto
 *     tags: [Gasto]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - costo
 *               - fechaGasto
 *               - sucursalId
 *             properties:
 *               nombre:
 *                 type: string
 *               costo:
 *                 type: number
 *               fechaGasto:
 *                 type: string
 *                 format: date
 *                 example: "2026-10-06"
 *               sucursalId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Gasto creado
 *       400:
 *         description: Datos inválidos o sucursal inexistente
 */
router.post("/", validate(gastoSchema), crearGasto);

/**
 * @swagger
 * /gastos/{id}:
 *   put:
 *     summary: Modificar un gasto
 *     tags: [Gasto]
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
 *               - nombre
 *               - costo
 *               - fechaGasto
 *               - sucursalId
 *             properties:
 *               nombre:
 *                 type: string
 *               costo:
 *                 type: number
 *               fechaGasto:
 *                 type: string
 *                 format: date
 *                 example: "2026-10-06"
 *               sucursalId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Gasto modificado
 *       400:
 *         description: Datos inválidos o sucursal inexistente
 *       404:
 *         description: Gasto no encontrado
 */
router.put("/:id", validate(gastoSchema), modificarGasto);

/**
 * @swagger
 * /gastos/{id}:
 *   delete:
 *     summary: Eliminar un gasto
 *     tags: [Gasto]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Gasto eliminado
 *       404:
 *         description: Gasto no encontrado
 */
router.delete("/:id", eliminarGasto);

module.exports = router;
