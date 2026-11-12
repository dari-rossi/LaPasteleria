const { autenticar, permitirRoles } = require("../middlewares/auth.middleware");
const express = require("express");

const {
    obtenerTiposEmpleado,
    obtenerTipoEmpleadoPorId,
    modificarTipoEmpleado
} = require("../controllers/tipoEmpleado.controller");

const validate = require("../middlewares/validate");
const { modificarTipoEmpleadoSchema } = require("../schemas/tipoEmpleado.schema");

const router = express.Router();

/**
 * @swagger
 * /tipos-empleado:
 *   get:
 *     summary: Listar tipos de empleado con la cantidad asignada, opcionalmente filtrados por rol
 *     tags: [Tipo Empleado]
 *     parameters:
 *       - in: query
 *         name: rol
 *         required: false
 *         schema:
 *           type: string
 *           enum: [GERENTE, MOZO, AYUDANTE_COCINA]
 *     responses:
 *       200:
 *         description: Lista de tipos de empleado
 *       400:
 *         description: Rol inválido
 */
router.get("/", autenticar, permitirRoles("DUENIO", "GERENTE"), obtenerTiposEmpleado);

/**
 * @swagger
 * /tipos-empleado/{id}:
 *   get:
 *     summary: Obtener un tipo de empleado por ID
 *     tags: [Tipo Empleado]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tipo de empleado encontrado
 *       404:
 *         description: Tipo de empleado no encontrado
 */
router.get("/:id", autenticar, permitirRoles("DUENIO", "GERENTE"), obtenerTipoEmpleadoPorId);

/**
 * @swagger
 * /tipos-empleado/{id}:
 *   put:
 *     summary: Modificar el sueldo de un tipo de empleado
 *     tags: [Tipo Empleado]
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
 *               - sueldo
 *             properties:
 *               sueldo:
 *                 type: number
 *     responses:
 *       200:
 *         description: Sueldo modificado
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Tipo de empleado no encontrado
 */
router.put("/:id", autenticar, permitirRoles("DUENIO"), validate(modificarTipoEmpleadoSchema), modificarTipoEmpleado);

module.exports = router;