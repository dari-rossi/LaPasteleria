const express = require("express");

const {
    obtenerTiposEmpleado,
    obtenerTipoEmpleadoPorId,
    crearTipoEmpleado,
    modificarTipoEmpleado,
    eliminarTipoEmpleado
} = require("../controllers/tipoEmpleado.controller");

const validate = require("../middlewares/validate");
const { tipoEmpleadoSchema } = require("../schemas/tipoEmpleado.schema");
const router = express.Router();

/**
 * @swagger
 * /tipos-empleado:
 *   get:
 *     summary: Listar tipos de empleado con la cantidad total de empleados de cada tipo, opcionalmente filtrados por tipo
 *     tags: [Tipo Empleado]
 *     parameters:
 *       - in: query
 *         name: tipoEmpleado
 *         required: false
 *         description: Filtra por tipo de empleado (coincidencia parcial)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de tipos de empleado (sin contraseña)
 */
router.get("/", obtenerTiposEmpleado);

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
 *         description: Tipo de empleado encontrado (sin contraseña)
 *       400:
 *         description: ID incorrecto
 *       404:
 *         description: Tipo de empleado no encontrado
 */
router.get("/:id", obtenerTipoEmpleadoPorId);

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
 *               - tipoEmpleado
 *               - sueldo
 *             properties:
 *               tipoEmpleado:
 *                 type: string
 *                 enum: [Gerente, Mozo, Ayudante de cocina]
 *                 example: Mozo
 *                 description: Solo se pueden crear estos tipos. El Dueño es una cuenta predefinida
 *               sueldo:
 *                 type: number
 *                 example: 500000
 *               usuario:
 *                 type: string
 *                 description: Opcional, pero si se envía hay que enviar también la contraseña
 *               contrasenia:
 *                 type: string
 *                 description: Mínimo 8 caracteres.
 *     responses:
 *       201:
 *         description: Tipo de empleado creado
 *       400:
 *         description: Datos inválidos o tipo de empleado que no es parte del sistema
 *       409:
 *         description: El tipo ya es parte del sistema o ya existe un tipo de empleado con ese usuario
 */
router.post("/", validate(tipoEmpleadoSchema), crearTipoEmpleado);

/**
 * @swagger
 * /tipos-empleado/{id}:
 *   put:
 *     summary: Modificar un tipo de empleado
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
 *               - tipoEmpleado
 *               - sueldo
 *             properties:
 *               tipoEmpleado:
 *                 type: string
 *                 enum: [Gerente, Mozo, Ayudante de cocina]
 *               sueldo:
 *                 type: number
 *               usuario:
 *                 type: string
 *                 description: Opcional. Si no se envía, no se modifica
 *               contrasenia:
 *                 type: string
 *                 description: Opcional (mínimo 8 caracteres). Si no se envía, no se modifica
 *     responses:
 *       200:
 *         description: Tipo de empleado modificado
 *       400:
 *         description: Datos inválidos o tipo de empleado que no es parte del sistema
 *       404:
 *         description: Tipo de empleado no encontrado
 *       409:
 *         description: El tipo ya es parte del sistema o ya existe otro tipo de empleado con ese usuario
 */
router.put("/:id", validate(tipoEmpleadoSchema), modificarTipoEmpleado);

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
 */
router.delete("/:id", eliminarTipoEmpleado);

module.exports = router;
