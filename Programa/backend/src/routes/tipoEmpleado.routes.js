const { autenticar, permitirRoles } = require("../middlewares/auth.middleware");
const express = require("express");

const {
    obtenerTiposEmpleado,
    obtenerTipoEmpleadoPorId,
    crearTipoEmpleado,
    modificarTipoEmpleado,
    eliminarTipoEmpleado
} = require("../controllers/tipoEmpleado.controller");

const validate = require("../middlewares/validate");
const { crearTipoEmpleadoSchema, modificarTipoEmpleadoSchema } = require("../schemas/tipoEmpleado.schema");
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
 *       400:
 *         description: ID incorrecto
 *       404:
 *         description: Tipo de empleado no encontrado
 */
router.get("/:id", autenticar, permitirRoles("DUENIO", "GERENTE"), obtenerTipoEmpleadoPorId);

/**
 * @swagger
 * /tipos-empleado:
 *   post:
 *     summary: Crear un tipo de empleado
 *     tags: [Tipo Empleado]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rol
 *               - sueldo
 *             properties:
 *               rol:
 *                 type: string
 *                 enum: [DUENIO, GERENTE, MOZO, AYUDANTE_COCINA]
 *                 example: MOZO
 *               sueldo:
 *                 type: number
 *                 example: 500000
 *     responses:
 *       201:
 *         description: Tipo de empleado creado
 *       400:
 *         description: Datos inválidos
 *       409:
 *         description: El rol ya es parte del sistema
 */
router.post("/", autenticar, permitirRoles("DUENIO"), validate(crearTipoEmpleadoSchema), crearTipoEmpleado);

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
 *         description: Tipo de empleado modificado
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Tipo de empleado no encontrado
 */
router.put("/:id", autenticar, permitirRoles("DUENIO"), validate(modificarTipoEmpleadoSchema), modificarTipoEmpleado);

/**
 * @swagger
 * /tipos-empleado/{id}:
 *   delete:
 *     summary: Eliminar un tipo de empleado
 *     tags: [Tipo Empleado]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tipo de empleado eliminado
 *       404:
 *         description: Tipo de empleado no encontrado
 *       409:
 *         description: Hay usuarios que tienen este rol
 */
router.delete("/:id", autenticar, permitirRoles("DUENIO"), eliminarTipoEmpleado);

module.exports = router;