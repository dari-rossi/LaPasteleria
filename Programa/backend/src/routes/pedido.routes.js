const express = require("express");

const {
    obtenerPedidos,
    obtenerPedidoPorId,
    crearPedido,
    modificarPedido,
    eliminarPedido
} = require("../controllers/pedido.controller");

const validate = require("../middlewares/validate");
const { pedidoSchema, pedidoModificarSchema } = require("../schemas/pedido.schema");
const router = express.Router();

/**
 * @swagger
 * /pedidos:
 *   get:
 *     summary: Obtener todos los pedidos (con mesa, cliente, sucursal, pago y productos)
 *     tags: [Pedido]
 *     responses:
 *       200:
 *         description: Lista de pedidos
 */
router.get("/", obtenerPedidos);

/**
 * @swagger
 * /pedidos/{id}:
 *   get:
 *     summary: Obtener un pedido por id
 *     tags: [Pedido]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *       404:
 *         description: Pedido no encontrado
 */
router.get("/:id", obtenerPedidoPorId);

/**
 * @swagger
 * /pedidos:
 *   post:
 *     summary: Crear un pedido (requiere mesa, cliente y sucursal; los productos son opcionales y se pueden cargar después)
 *     tags: [Pedido]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - comensales
 *               - mesaId
 *               - clienteId
 *               - sucursalId
 *             properties:
 *               comensales:
 *                 type: integer
 *               mesaId:
 *                 type: integer
 *               clienteId:
 *                 type: integer
 *               sucursalId:
 *                 type: integer
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productoId
 *                     - cantidad
 *                   properties:
 *                     productoId:
 *                       type: integer
 *                     cantidad:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Pedido creado
 *       400:
 *         description: Datos inválidos o mesa, cliente, sucursal o producto inexistente
 */
router.post("/", validate(pedidoSchema), crearPedido);

/**
 * @swagger
 * /pedidos/{id}:
 *   put:
 *     summary: Modificar el estado y los comensales de un pedido
 *     tags: [Pedido]
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
 *               - estadoPedido
 *               - comensales
 *             properties:
 *               estadoPedido:
 *                 type: string
 *                 enum: [Pendiente, En preparación, Entregado, Pagado, Cancelado]
 *               comensales:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Pedido modificado
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Pedido no encontrado
 */
router.put("/:id", validate(pedidoModificarSchema), modificarPedido);

/**
 * @swagger
 * /pedidos/{id}:
 *   delete:
 *     summary: Eliminar un pedido (también elimina sus items)
 *     tags: [Pedido]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pedido eliminado
 *       404:
 *         description: Pedido no encontrado
 *       409:
 *         description: El pedido tiene un pago registrado
 */
router.delete("/:id", eliminarPedido);

module.exports = router;
