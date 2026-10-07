const express = require("express");

const {
    obtenerPagos,
    obtenerPagoPorId,
    crearPago
} = require("../controllers/pago.controller");

const validate = require("../middlewares/validate");
const { pagoSchema } = require("../schemas/pago.schema");
const router = express.Router();

/**
 * @swagger
 * /pagos:
 *   get:
 *     summary: Obtener todos los pagos
 *     tags: [Pago]
 *     responses:
 *       200:
 *         description: Lista de pagos
 */
router.get("/", obtenerPagos);

/**
 * @swagger
 * /pagos/{idPedido}:
 *   get:
 *     summary: Obtener un pago por idPedido
 *     tags: [Pago]
 *     parameters:
 *       - in: path
 *         name: idPedido
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pago encontrado
 *       404:
 *         description: Pago no encontrado
 */
router.get("/:idPedido", obtenerPagoPorId);


/**
 * @swagger
 * /pagos:
 *   post:
 *     summary: Registrar un pago
 *     tags: [Pago]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idPedido
 *               - metodoPago
 *             properties:
 *               idPedido:
 *                 type: integer
 *               metodoPago:
 *                 type: string
 *                 enum:
 *                   - Efectivo
 *                   - Tarjeta
 *                   - Transferencia
 *     responses:
 *       201:
 *         description: Pago creado
 *       400:
 *         description: Datos inválidos
 */
router.post("/", validate(pagoSchema), crearPago);

module.exports = router;