const express = require("express");

const {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    modificarProducto,
    eliminarProducto
} = require("../controllers/producto.controller");

const validate = require("../middlewares/validate");
const { productoSchema } = require("../schemas/producto.schema");

const router = express.Router();

/**
 * @swagger
 * /productos:
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Producto]
 *     responses:
 *       200:
 *         description: Lista de productos
 */
router.get("/", obtenerProductos);

/**
 * @swagger
 * /productos/{id}:
 *   get:
 *     summary: Obtener un producto por ID
 *     tags: [Producto]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producto encontrado
 *       404:
 *         description: Producto no encontrado
 */
router.get("/:id", obtenerProductoPorId);

/**
 * @swagger
 * /productos:
 *   post:
 *     summary: Crear un producto
 *     tags: [Producto]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - tipoProducto
 *               - precio
 *               - proveedor
 *             properties:
 *               nombre:
 *                 type: string
 *               tipoProducto:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               precio:
 *                 type: number
 *               proveedor:
 *                 type: string
 *     responses:
 *       201:
 *         description: Producto creado
 *       400:
 *         description: Datos inválidos
 */
router.post("/", validate(productoSchema), crearProducto);

/**
 * @swagger
 * /productos/{id}:
 *   put:
 *     summary: Modificar un producto
 *     tags: [Producto]
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
 *               - nombre
 *               - tipoProducto
 *               - precio
 *               - proveedor
 *             properties:
 *               nombre:
 *                 type: string
 *               tipoProducto:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               precio:
 *                 type: number
 *               proveedor:
 *                 type: string
 *     responses:
 *       200:
 *         description: Producto modificado
 *       404:
 *         description: Producto no encontrado
 */
router.put("/:id", modificarProducto);

/**
 * @swagger
 * /productos/{id}:
 *   delete:
 *     summary: Eliminar un producto
 *     tags: [Producto]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producto eliminado
 *       404:
 *         description: Producto no encontrado
 */
router.delete("/:id", eliminarProducto);

module.exports = router;