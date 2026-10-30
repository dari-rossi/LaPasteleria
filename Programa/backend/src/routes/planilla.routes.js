const { autenticar, permitirRoles } = require("../middlewares/auth.middleware");
const express = require("express");

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
 *     summary: Planilla diaria de la sucursal del gerente
 *     tags: [Planilla]
 *     parameters:
 *       - in: query
 *         name: fecha
 *         required: false
 *         description: Día a consultar (AAAA-MM-DD). Si no se indica, es hoy
 *         schema:
 *           type: string
 *           example: "2026-10-29"
 *     responses:
 *       200:
 *         description: Ventas, clientes, promedios, producto estrella y monto total del día
 *       400:
 *         description: Fecha inválida o futura
 */
router.get("/diaria", autenticar, permitirRoles("GERENTE"), obtenerPlanillaDiaria);

/**
 * @swagger
 * /planillas/mensual:
 *   get:
 *     summary: Planilla mensual de la sucursal del gerente
 *     tags: [Planilla]
 *     parameters:
 *       - in: query
 *         name: mes
 *         required: false
 *         description: Mes a consultar (AAAA-MM). Si no se indica, es el mes actual
 *         schema:
 *           type: string
 *           example: "2026-10"
 *     responses:
 *       200:
 *         description: Ventas, clientes, promedios y producto estrella del mes
 *       400:
 *         description: Mes inválido o futuro
 */
router.get("/mensual", autenticar, permitirRoles("GERENTE"), obtenerPlanillaMensual);

/**
 * @swagger
 * /planillas/general:
 *   get:
 *     summary: Planilla general del mes actual (todas las sucursales)
 *     tags: [Planilla]
 *     responses:
 *       200:
 *         description: Producto estrella, sucursal más concurrida y sucursal con mayor recaudación
 */
router.get("/general", autenticar, permitirRoles("DUENIO"), obtenerPlanillaGeneral);

module.exports = router;