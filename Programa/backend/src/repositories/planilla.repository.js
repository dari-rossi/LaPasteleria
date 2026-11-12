const prisma = require("../prisma");

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