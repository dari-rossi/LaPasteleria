const prisma = require("../prisma");

const filtroPorTipoProducto = (tipoProducto) => {
    return tipoProducto
        ? { tipoProducto: { contains: tipoProducto } }
        : {};
};

const filtroPorNombre = (nombre) => {
    return nombre ? { nombre: { contains: nombre } } : {};
};

const obtenerTodos = async ({ tipoProducto, nombre, sucursalId, popularidad } = {}) => {
    const productos = await prisma.producto.findMany({
        where: {
            ...filtroPorTipoProducto(tipoProducto),
            ...filtroPorNombre(nombre)
        },
        orderBy: {
            idProducto: "asc"
        }
    });

    if (popularidad !== "desc") {
        return productos;
    }

    const ventas = await prisma.itemProducto.groupBy({
        by: ["productoId"],
        where: {
            pedido: {
                sucursalId: Number(sucursalId)
            }
        },
        _sum: {
            cantidad: true
        }
    });

    const cantidadesVendidas = new Map(
        ventas.map((venta) => [
            venta.productoId,
            venta._sum.cantidad ?? 0
        ])
    );

    return productos.sort((a, b) => {
        const cantidadA = cantidadesVendidas.get(a.idProducto) ?? 0;
        const cantidadB = cantidadesVendidas.get(b.idProducto) ?? 0;

        return cantidadB - cantidadA;
    });
};

const obtenerPorId = async (id) => {
    return await prisma.producto.findUnique({
        where: { idProducto: id }
    });
};

const crear = async (datos) => {
    return await prisma.producto.create({ data: datos });
};

const modificar = async (id, datos) => {
    return await prisma.producto.update({
        where: { idProducto: id },
        data: datos
    });
};

const eliminar = async (id) => {
    return await prisma.producto.delete({
        where: { idProducto: id }
    });
};

module.exports = {
    obtenerTodos,
    obtenerPorId,
    crear,
    modificar,
    eliminar
};