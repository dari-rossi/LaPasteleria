const express = require("express");
const { autenticar, permitirRoles } = require("../middlewares/auth.middleware");

const {
    obtenerPlanillaDiaria,
    obtenerPlanillaMensual,
    obtenerPlanillaGeneral
} = require("../controllers/planilla.controller");

const router = express.Router();

/**
 * @swagger
 * /planillas/diaria:
 *   get:
 *     summary: Obtiene la planilla diaria de una sucursal
 *     tags: [Planilla]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fecha
 *         required: false
 *         description: Día a consultar (AAAA-MM-DD). Si no se indica, se utiliza el día actual.
 *         schema:
 *           type: string
 *           example: "2026-10-29"
 *       - in: query
 *         name: sucursalId
 *         required: false
 *         description: ID de la sucursal. Obligatorio para el dueño; el gerente utiliza su propia sucursal.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Resumen de ventas, clientes, promedios y producto estrella.
 *       400:
 *         description: Fecha inválida, fecha futura o sucursal requerida.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Rol no autorizado.
 */
router.get(
    "/diaria",
    autenticar,
    permitirRoles("GERENTE", "DUENIO"),
    obtenerPlanillaDiaria
);

/**
 * @swagger
 * /planillas/mensual:
 *   get:
 *     summary: Obtiene la planilla mensual de una sucursal
 *     tags: [Planilla]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: mes
 *         required: false
 *         description: Mes a consultar (AAAA-MM). Si no se indica, se utiliza el mes actual.
 *         schema:
 *           type: string
 *           example: "2026-10"
 *       - in: query
 *         name: sucursalId
 *         required: false
 *         description: ID de la sucursal. Obligatorio para el dueño; el gerente utiliza su propia sucursal.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Resumen de ventas, clientes, promedios y producto estrella.
 *       400:
 *         description: Mes inválido, mes futuro o sucursal requerida.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Rol no autorizado.
 */
router.get(
    "/mensual",
    autenticar,
    permitirRoles("GERENTE", "DUENIO"),
    obtenerPlanillaMensual
);

/**
 * @swagger
 * /planillas/general:
 *   get:
 *     summary: Obtiene la planilla general del mes actual
 *     tags: [Planilla]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Producto estrella, sucursal más concurrida y sucursal con mayor recaudación.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Solo el dueño puede consultar esta planilla.
 */
router.get(
    "/general",
    autenticar,
    permitirRoles("DUENIO"),
    obtenerPlanillaGeneral
);

module.exports = router;