const express = require("express");

const {
    obtenerTiposEmpleadoDeSucursal,
    asignarTipoEmpleado,
    modificarCantidad,
    quitarTipoEmpleado
} = require("../controllers/sucursalTipoEmpleado.controller");

const validate = require("../middlewares/validate");
const { asignarTipoEmpleadoSchema, modificarCantidadSchema } = require("../schemas/sucursalTipoEmpleado.schema");
const router = express.Router();

// Este router se monta en /sucursales (ver server.js)

/**
 * @swagger
 * /sucursales/{sucursalId}/tipos-empleado:
 *   get:
 *     summary: Obtener los tipos de empleado de una sucursal con su cantidad
 *     tags: [Sucursal - Tipo Empleado]
 *     parameters:
 *       - in: path
 *         name: sucursalId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de tipos de empleado de la sucursal
 *       400:
 *         description: ID incorrecto
 *       404:
 *         description: Sucursal no encontrada
 */
router.get("/:sucursalId/tipos-empleado", obtenerTiposEmpleadoDeSucursal);

/**
 * @swagger
 * /sucursales/{sucursalId}/tipos-empleado:
 *   post:
 *     summary: Asignar un tipo de empleado a una sucursal con su cantidad
 *     tags: [Sucursal - Tipo Empleado]
 *     parameters:
 *       - in: path
 *         name: sucursalId
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
 *               - tipoEmpleadoId
 *               - cantidad
 *             properties:
 *               tipoEmpleadoId:
 *                 type: integer
 *               cantidad:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       201:
 *         description: Tipo de empleado asignado
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Sucursal o tipo de empleado no encontrado
 *       409:
 *         description: El tipo de empleado ya está asignado a la sucursal
 */
router.post("/:sucursalId/tipos-empleado", validate(asignarTipoEmpleadoSchema), asignarTipoEmpleado);

/**
 * @swagger
 * /sucursales/{sucursalId}/tipos-empleado/{tipoEmpleadoId}:
 *   put:
 *     summary: Modificar la cantidad de empleados de un tipo en una sucursal
 *     tags: [Sucursal - Tipo Empleado]
 *     parameters:
 *       - in: path
 *         name: sucursalId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: tipoEmpleadoId
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
 *               - cantidad
 *             properties:
 *               cantidad:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Cantidad modificada
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: El tipo de empleado no está asignado a la sucursal
 */
router.put("/:sucursalId/tipos-empleado/:tipoEmpleadoId", validate(modificarCantidadSchema), modificarCantidad);

/**
 * @swagger
 * /sucursales/{sucursalId}/tipos-empleado/{tipoEmpleadoId}:
 *   delete:
 *     summary: Quitar un tipo de empleado de una sucursal (ya no hay empleados de ese tipo ahí)
 *     tags: [Sucursal - Tipo Empleado]
 *     parameters:
 *       - in: path
 *         name: sucursalId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: tipoEmpleadoId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tipo de empleado quitado de la sucursal
 *       404:
 *         description: El tipo de empleado no está asignado a la sucursal
 */
router.delete("/:sucursalId/tipos-empleado/:tipoEmpleadoId", quitarTipoEmpleado);

module.exports = router;
