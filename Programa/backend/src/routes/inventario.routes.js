const { autenticar, permitirRoles } = require("../middlewares/auth.middleware");
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
 *     summary: Obtiene los registros de inventario, opcionalmente filtrados por producto
 *     tags: [Inventario]
 *     parameters:
 *       - in: query
 *         name: productoId
 *         required: false
 *         description: Filtra el inventario por ID de producto
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de inventarios devuelta exitosamente.
 *       400:
 *         description: ID de producto inválido.
 */
router.get('/', autenticar, permitirRoles("DUENIO", "GERENTE", "AYUDANTE_COCINA"), inventarioController.getAll);

/**
 * @swagger
 * /inventario/stock-bajo:
 *   get:
 *     summary: Obtiene los productos con stock bajo de una sucursal
 *     tags: [Inventario]
 *     parameters:
 *       - in: query
 *         name: sucursalId
 *         required: false
 *         description: ID de la sucursal (obligatorio para el dueño)
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de inventarios con stock menor o igual al mínimo
 *       400:
 *         description: ID de sucursal inválido o faltante
 *       403:
 *         description: Sin permiso para consultar otra sucursal
 */
router.get('/stock-bajo', autenticar, permitirRoles("DUENIO", "GERENTE", "AYUDANTE_COCINA"), inventarioController.obtenerStockBajo);

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
router.post('/', autenticar, permitirRoles("DUENIO"), validate(inventarioSchema), inventarioController.create);
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
router.put('/:id', autenticar, permitirRoles("DUENIO", "AYUDANTE_COCINA"), validate(inventarioSchema.partial()), inventarioController.update);
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
router.delete('/:id',autenticar, permitirRoles("DUENIO", "GERENTE"), inventarioController.remove);

module.exports = router;