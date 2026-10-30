const prisma = require("../prisma");

// Obtiene los pagos registrados entre dos fechas.
// Si se indica una sucursal, solo devuelve sus pagos.
const obtenerPagosDelPeriodo = async (desde, hasta, sucursalId = null) => {
    return await prisma.pago.findMany({
        where: {
            fechaHora: {
                gte: desde,
                lt: hasta
            },
            ...(sucursalId !== null
                ? {
                    pedido: {
                        is: {
                            sucursalId: Number(sucursalId)
                        }
                    }
                }
                : {})
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
                            producto: {
                                select: {
                                    nombre: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });
};

module.exports = {
    obtenerPagosDelPeriodo
};