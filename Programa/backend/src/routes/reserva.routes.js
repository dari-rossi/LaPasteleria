const express = require("express");

const {
    obtenerReservas,
    obtenerReservaPorId,
    crearReserva,
    modificarReserva,
    eliminarReserva
} = require("../controllers/reserva.controller");

const validate = require("../middlewares/validate");
const { reservaSchema, reservaModificarSchema } = require("../schemas/reserva.schema");

const router = express.Router();

/**
 * @swagger
 * /reservas:
 *   get:
 *     summary: Obtener todas las reservas
 *     tags: [Reserva]
 *     responses:
 *       200:
 *         description: Lista de reservas
 */
router.get("/", obtenerReservas);

/**
 * @swagger
 * /reservas/{idMesa}/{fechaHora}:
 *   get:
 *     summary: Obtener una reserva por mesa y fecha/hora
 *     tags: [Reserva]
 *     parameters:
 *       - in: path
 *         name: idMesa
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: fechaHora
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         example: "2026-10-10T21:00:00.000Z"
 *     responses:
 *       200:
 *         description: Reserva encontrada
 *       400:
 *         description: Mesa o fecha/hora incorrectas
 *       404:
 *         description: Reserva no encontrada
 */
router.get("/:idMesa/:fechaHora", obtenerReservaPorId);

/**
 * @swagger
 * /reservas:
 *   post:
 *     summary: Crear una reserva
 *     tags: [Reserva]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idMesa
 *               - fechaHoraReservada
 *               - cantComensales
 *               - estadoReserva
 *               - dni
 *             properties:
 *               idMesa:
 *                 type: integer
 *               fechaHoraReservada:
 *                 type: string
 *                 format: date-time
 *               cantComensales:
 *                 type: integer
 *               estadoReserva:
 *                 type: string
 *                 enum: [Activa, En curso, Finalizada, Cancelada]
 *               dni:
 *                 type: string
 *     responses:
 *       201:
 *         description: Reserva creada
 *       400:
 *         description: Datos inválidos
 *       409:
 *         description: Ya existe una reserva para esa mesa en esa fecha y hora
 */
router.post("/", validate(reservaSchema), crearReserva);

/**
 * @swagger
 * /reservas/{idMesa}/{fechaHora}:
 *   put:
 *     summary: Modificar una reserva
 *     tags: [Reserva]
 *     parameters:
 *       - in: path
 *         name: idMesa
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: fechaHora
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         example: "2026-10-10T21:00:00.000Z"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cantComensales
 *               - estadoReserva
 *               - dni
 *             properties:
 *               cantComensales:
 *                 type: integer
 *               estadoReserva:
 *                 type: string
 *                 enum: [Activa, En curso, Finalizada, Cancelada]
 *               dni:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reserva modificada
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Reserva no encontrada
 */
router.put("/:idMesa/:fechaHora", validate(reservaModificarSchema), modificarReserva);

/**
 * @swagger
 * /reservas/{idMesa}/{fechaHora}:
 *   delete:
 *     summary: Eliminar una reserva
 *     tags: [Reserva]
 *     parameters:
 *       - in: path
 *         name: idMesa
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: fechaHora
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         example: "2026-10-10T21:00:00.000Z"
 *     responses:
 *       200:
 *         description: Reserva eliminada
 *       404:
 *         description: Reserva no encontrada
 */
router.delete("/:idMesa/:fechaHora", eliminarReserva);

module.exports = router;