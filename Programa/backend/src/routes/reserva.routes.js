const express = require("express");
const { autenticar, permitirRoles } = require("../middlewares/auth.middleware");

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

const ROLES = ["DUENIO", "GERENTE", "MOZO"];

/**
 * @swagger
 * /reservas:
 *   get:
 *     summary: Obtener las reservas de la sucursal
 *     tags: [Reserva]
 *     responses:
 *       200:
 *         description: Lista de reservas
 */
router.get("/", autenticar, permitirRoles(...ROLES), obtenerReservas);

/**
 * @swagger
 * /reservas:
 *   get:
 *     summary: Obtener las reservas de la sucursal, de la más reciente a la más antigua
 *     tags: [Reserva]
 *     parameters:
 *       - in: query
 *         name: estadoReserva
 *         required: false
 *         description: Filtra por estado de la reserva
 *         schema:
 *           type: string
 *           enum: [Activa, En curso, Finalizada, Cancelada]
 *     responses:
 *       200:
 *         description: Lista de reservas
 *       400:
 *         description: Estado inválido o sucursal no indicada
 */
router.get("/:idMesa/:fechaHora", autenticar, permitirRoles(...ROLES), obtenerReservaPorId);

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
router.post("/", autenticar, permitirRoles("MOZO"), validate(reservaSchema), crearReserva);

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
router.put("/:idMesa/:fechaHora", autenticar, permitirRoles("MOZO"), validate(reservaModificarSchema), modificarReserva);

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
router.delete("/:idMesa/:fechaHora", autenticar, permitirRoles("MOZO"), eliminarReserva);

module.exports = router;