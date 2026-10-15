const { autenticar, permitirRoles } = require("../middlewares/auth.middleware");
const express = require("express");

const {
    obtenerSucursales,
    obtenerSucursalPorId,
    crearSucursal,
    modificarSucursal,
    eliminarSucursal
} = require("../controllers/sucursal.controller");

const validate = require("../middlewares/validate");
const { sucursalSchema } = require("../schemas/sucursal.schema");
const router = express.Router();

/**
 * @swagger
 * /sucursales:
 *   get:
 *     summary: Obtener todas las sucursales
 *     tags: [Sucursal]
 *     responses:
 *       200:
 *         description: Lista de sucursales
 */
router.get("/",autenticar, permitirRoles("DUENIO"), obtenerSucursales);

/**
 * @swagger
 * /sucursales/{id}:
 *   get:
 *     summary: Obtener una sucursal por ID
 *     tags: [Sucursal]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sucursal encontrada
 *       404:
 *         description: Sucursal no encontrada
 */
router.get("/:id",autenticar, permitirRoles("DUENIO"), obtenerSucursalPorId);

/**
 * @swagger
 * /sucursales:
 *   post:
 *     summary: Crear una sucursal
 *     tags: [Sucursal]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - telefono
 *               - direccion
 *               - codigoPostal
 *               - horarios
 *             properties:
 *               telefono:
 *                 type: string
 *               direccion:
 *                 type: string
 *               codigoPostal:
 *                 type: string
 *               horarios:
 *                 type: string
 *     responses:
 *       201:
 *         description: Sucursal creada
 *       400:
 *         description: Datos inválidos
 */
router.post("/",autenticar, permitirRoles("DUENIO"), validate(sucursalSchema), crearSucursal);

/**
 * @swagger
 * /sucursales/{id}:
 *   put:
 *     summary: Modificar una sucursal
 *     tags: [Sucursal]
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
 *               - telefono
 *               - direccion
 *               - codigoPostal
 *               - horarios
 *             properties:
 *               telefono:
 *                 type: string
 *               direccion:
 *                 type: string
 *               codigoPostal:
 *                 type: string
 *               horarios:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sucursal modificada
 *       404:
 *         description: Sucursal no encontrada
 */
router.put("/:id",autenticar, permitirRoles("DUENIO"), validate(sucursalSchema), modificarSucursal);

/**
 * @swagger
 * /sucursales/{id}:
 *   delete:
 *     summary: Eliminar una sucursal
 *     tags: [Sucursal]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sucursal eliminada
 *       404:
 *         description: Sucursal no encontrada
 */
router.delete("/:id",autenticar, permitirRoles("DUENIO"), eliminarSucursal);

module.exports = router;