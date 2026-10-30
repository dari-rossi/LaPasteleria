const { autenticar, permitirRoles } = require("../middlewares/auth.middleware");
const express = require("express");

const {
    obtenerItemProductos,
    obtenerItemProductosPorIdPedido,
    obtenerItemProductoPorId,
    crearItemProducto,
    modificarItemProducto,
    eliminarItemProducto
} = require("../controllers/itemProducto.controller");

const validate = require("../middlewares/validate");
const { itemProductoSchema, itemProductoModificarSchema } = require("../schemas/itemProducto.schema");
const router = express.Router();
const ROLES = ["DUENIO", "GERENTE", "MOZO"];

/**
 * @swagger
 * /itemProducto:
 *   get:
 *     summary: Obtener todos los items de producto
 *     tags: [ItemProducto]
 *     responses:
 *       200:
 *         description: Lista de items
 */
router.get("/",autenticar, permitirRoles(...ROLES), obtenerItemProductos);

/**
 * @swagger
 * /itemProducto/pedido/{pedidoId}:
 *   get:
 *     summary: Obtener los items de un pedido
 *     tags: [ItemProducto]
 *     parameters:
 *       - in: path
 *         name: pedidoId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Items del pedido
 */
router.get("/pedido/:pedidoId",autenticar, permitirRoles(...ROLES), obtenerItemProductosPorIdPedido);

/**
 * @swagger
 * /itemProducto/{id}:
 *   get:
 *     summary: Obtener un item por id
 *     tags: [ItemProducto]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Item encontrado
 *       404:
 *         description: Item no encontrado
 */
router.get("/:id",autenticar, permitirRoles(...ROLES), obtenerItemProductoPorId);

/**
 * @swagger
 * /itemProducto:
 *   post:
 *     summary: Agregar un producto a un pedido existente
 *     tags: [ItemProducto]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pedidoId
 *               - productoId
 *               - cantidad
 *             properties:
 *               pedidoId:
 *                 type: integer
 *               productoId:
 *                 type: integer
 *               cantidad:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Item creado
 *       400:
 *         description: Datos inválidos o pedido/producto inexistente
 *       409:
 *         description: Ese producto ya está cargado en el pedido
 */
router.post("/",autenticar, permitirRoles(...ROLES), validate(itemProductoSchema), crearItemProducto);

/**
 * @swagger
 * /itemProducto/{id}:
 *   put:
 *     summary: Modificar la cantidad de un item (se recalcula el subTotal)
 *     tags: [ItemProducto]
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
 *               - cantidad
 *             properties:
 *               cantidad:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Item modificado
 *       404:
 *         description: Item no encontrado
 */
router.put("/:id",autenticar, permitirRoles(...ROLES), validate(itemProductoModificarSchema), modificarItemProducto);

/**
 * @swagger
 * /itemProducto/{id}:
 *   delete:
 *     summary: Eliminar un item de un pedido
 *     tags: [ItemProducto]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Item eliminado
 *       404:
 *         description: Item no encontrado
 */
router.delete("/:id",autenticar, permitirRoles(...ROLES), eliminarItemProducto);

module.exports = router;
