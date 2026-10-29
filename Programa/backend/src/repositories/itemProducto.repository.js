const prisma = require("../prisma");
const { ESTADOS_FINALES } = require("../config/estadosPedido");
const { lanzarError } = require("../config/errores");

const redondear = (valor) => Math.round(valor * 100) / 100;

const obtenerTodos = async () => {
    return await prisma.itemProducto.findMany({
        include: { pedido: true, producto: true }
    });
};

const obtenerPorIdPedido = async (pedidoId) => {
    return await prisma.itemProducto.findMany({
        where: { pedidoId },
        include: { producto: true }
    });
};

const obtenerPorId = async (id) => {
    return await prisma.itemProducto.findUnique({
        where: { idItemProducto: id },
        include: { producto: true }
    });
};

const obtenerPedidoAbierto = async (tx, pedidoId) => {
    const pedido = await tx.pedido.findUnique({ where: { idPedido: pedidoId } });

    if (!pedido) {
        lanzarError("El pedido indicado no existe.", 400);
    }

    if (ESTADOS_FINALES.includes(pedido.estadoPedido)) {
        lanzarError(`No se puede modificar un pedido ${pedido.estadoPedido.toLowerCase()}.`, 409);
    }

    return pedido;
};

const descontarStock = async (tx, sucursalId, productoId, cantidad) => {
    const resultado = await tx.inventario.updateMany({
        where: { sucursalId, productoId, stock: { gte: cantidad } },
        data: { stock: { decrement: cantidad } }
    });

    if (resultado.count === 0) {
        lanzarError("No hay stock suficiente de ese producto en la sucursal.", 409);
    }
};

const devolverStock = async (tx, sucursalId, productoId, cantidad) => {
    await tx.inventario.updateMany({
        where: { sucursalId, productoId },
        data: { stock: { increment: cantidad } }
    });
};

const agregar = async (pedidoId, producto, cantidad) => {
    return await prisma.$transaction(async (tx) => {
        const pedido = await obtenerPedidoAbierto(tx, pedidoId);

        await descontarStock(tx, pedido.sucursalId, producto.idProducto, cantidad);

        const existente = await tx.itemProducto.findUnique({
            where: { pedidoId_productoId: { pedidoId, productoId: producto.idProducto } }
        });

        if (existente) {
            const nuevaCantidad = existente.cantidad + cantidad;

            return await tx.itemProducto.update({
                where: { idItemProducto: existente.idItemProducto },
                data: { cantidad: nuevaCantidad, subTotal: redondear(nuevaCantidad * producto.precio) },
                include: { producto: true }
            });
        }

        return await tx.itemProducto.create({
            data: {
                pedidoId,
                productoId: producto.idProducto,
                cantidad,
                subTotal: redondear(cantidad * producto.precio)
            },
            include: { producto: true }
        });
    });
};

const cambiarCantidad = async (id, cantidad) => {
    return await prisma.$transaction(async (tx) => {
        const item = await tx.itemProducto.findUnique({
            where: { idItemProducto: id },
            include: { producto: true }
        });

        const pedido = await obtenerPedidoAbierto(tx, item.pedidoId);
        const diferencia = cantidad - item.cantidad;

        if (diferencia > 0) {
            await descontarStock(tx, pedido.sucursalId, item.productoId, diferencia);
        } else if (diferencia < 0) {
            await devolverStock(tx, pedido.sucursalId, item.productoId, -diferencia);
        }

        return await tx.itemProducto.update({
            where: { idItemProducto: id },
            data: { cantidad, subTotal: redondear(cantidad * item.producto.precio) },
            include: { producto: true }
        });
    });
};

const quitar = async (id) => {
    return await prisma.$transaction(async (tx) => {
        const item = await tx.itemProducto.findUnique({ where: { idItemProducto: id } });
        const pedido = await obtenerPedidoAbierto(tx, item.pedidoId);

        await devolverStock(tx, pedido.sucursalId, item.productoId, item.cantidad);

        return await tx.itemProducto.delete({ where: { idItemProducto: id } });
    });
};

module.exports = {
    obtenerTodos,
    obtenerPorIdPedido,
    obtenerPorId,
    agregar,
    cambiarCantidad,
    quitar
};