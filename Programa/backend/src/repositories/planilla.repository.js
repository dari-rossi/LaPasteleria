const prisma = require("../prisma");

// Pagos registrados entre dos fechas, con la cantidad de comensales del pedido
// y los productos que se vendieron. Si se indica sucursalId, solo los de esa sucursal.
const obtenerPagosDelPeriodo = async (desde, hasta, sucursalId) => {
    return await prisma.pago.findMany({
        where: {
            fechaHora: { gte: desde, lt: hasta },
            ...(sucursalId !== undefined ? { pedido: { sucursalId } } : {})
        },
        include: {
            pedido: {
                select: {
                    sucursalId: true,
                    comensales: true,
                    items: {
                        select: {
                            productoId: true,
                            cantidad: true,
                            producto: { select: { nombre: true } }
                        }
                    }
                }
            }
        }
    });
};

module.exports = { obtenerPagosDelPeriodo };