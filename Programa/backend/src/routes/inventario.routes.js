const express = require('express');
const router = express.Router();
const inventarioController = require('../controllers/inventario.controller');
const validate = require('../middlewares/validate');
const { inventarioSchema } = require('../schemas/inventario.schema');

/**
 * @swagger
 * tags:
 *   name: Inventario
 *   description: Gestión del stock de productos en las sucursales
 */

/**
 * @swagger
 * /inventario:
 *   get:
 *     summary: Obtiene todos los registros de inventario
 *     tags: [Inventario]
 *     responses:
 *       200:
 *         description: Lista de inventarios devuelta exitosamente.
 */
router.get('/', inventarioController.getAll);

/**
 * @swagger
 * /inventario:
 *   post:
 *     summary: Crea un nuevo registro de inventario
 *     tags: [Inventario]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stock:
 *                 type: integer
 *                 example: 50
 *               stockMin:
 *                 type: integer
 *                 example: 10
 *               sucursalId:
 *                 type: integer
 *                 example: 1
 *               productoId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Inventario creado exitosamente.
 *       400:
 *         description: Error de validación o datos incorrectos.
 */
router.post('/', validate(inventarioSchema), inventarioController.create);

/**
 * @swagger
 * /inventario/{id}:
 *   put:
 *     summary: Actualiza un inventario existente
 *     tags: [Inventario]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del inventario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stock:
 *                 type: integer
 *                 example: 45
 *     responses:
 *       200:
 *         description: Inventario actualizado.
 */
router.put('/:id', validate(inventarioSchema.partial()), inventarioController.update);

/**
 * @swagger
 * /inventario/{id}:
 *   delete:
 *     summary: Elimina un registro de inventario
 *     tags: [Inventario]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del inventario
 *     responses:
 *       204:
 *         description: Inventario eliminado.
 */
router.delete('/:id', inventarioController.remove);

module.exports = router;