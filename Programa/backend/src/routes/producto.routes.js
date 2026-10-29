const { autenticar, permitirRoles } = require("../middlewares/auth.middleware");
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
router.get("/", autenticar, permitirRoles("DUENIO", "GERENTE", "MOZO", "AYUDANTE_COCINA"), obtenerProductos);

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
router.get("/:id", autenticar, permitirRoles("DUENIO", "GERENTE", "MOZO", "AYUDANTE_COCINA"), obtenerProductoPorId);

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
 *               - stockMinimo
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
 *               stockMinimo:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       201:
 *         description: Producto creado
 *       400:
 *         description: Datos inválidos
 */
router.post("/", autenticar, permitirRoles("DUENIO"), validate(productoSchema), crearProducto);

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
 *               - stockMinimo
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
 *               stockMinimo:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       200:
 *         description: Producto modificado
 *       404:
 *         description: Producto no encontrado
 */
router.put("/:id", autenticar, permitirRoles("DUENIO"), validate(productoSchema), modificarProducto);

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
router.delete("/:id", autenticar, permitirRoles("DUENIO"), eliminarProducto);

module.exports = router;