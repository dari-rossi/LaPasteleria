const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
    const sucursales = [
        { id: 1, telefono: "3414000001", direccion: "Presidente Roca 1823", codigoPostal: "2000", horarios: "Lunes a domingos de 8:00 a 21:00" },
        { id: 2, telefono: "3414000002", direccion: "Rodriguez 1532", codigoPostal: "2000", horarios: "Lunes a domingos de 8:00 a 21:00" }
    ];

    for (const sucursal of sucursales) {
        await prisma.sucursal.upsert({
            where: { id: sucursal.id },
            update: {
                telefono: sucursal.telefono,
                direccion: sucursal.direccion,
                codigoPostal: sucursal.codigoPostal,
                horarios: sucursal.horarios
            },
            create: sucursal
        });
    }

    const productos = [
        { idProducto: 1, nombre: "Espresso", tipoProducto: "Ambos", descripcion: "Café espresso", stockMin: 50, precio: 1800,  proveedor: "La Fazenda" },
        { idProducto: 2, nombre: "Americano", tipoProducto: "Ambos", descripcion: "Café americano", stockMin: 50,precio: 2000, proveedor: "La Fazenda" },
        { idProducto: 3, nombre: "Macchiato", tipoProducto: "Ambos", descripcion: "Espresso con espuma de leche", stockMin: 50, precio: 2200, proveedor: "La Fazenda" },
        { idProducto: 4, nombre: "Latte", tipoProducto: "Ambos", descripcion: "Café con leche vaporizada", stockMin: 50, precio: 2500, proveedor: "La Fazenda" },
        { idProducto: 5, nombre: "Cappuccino", tipoProducto: "Ambos", descripcion: "Café con leche y espuma", stockMin: 50, precio: 2500, proveedor: "La Fazenda" },
        { idProducto: 6, nombre: "Iced Coffee", tipoProducto: "Ambos", descripcion: "Café frío con hielo", stockMin: 50, precio: 2800, proveedor: "La Fazenda" },
        { idProducto: 7, nombre: "Chipa", tipoProducto: "Día", descripcion: "Panificado de queso", stockMin: 50, precio: 1000, proveedor: "Cocina La Esquina" },
        { idProducto: 8, nombre: "Croissant gratinado", tipoProducto: "Día", descripcion: "Croissant gratinado", stockMin: 50, precio: 3500, proveedor: "Cocina La Esquina" },
        { idProducto: 9, nombre: "Panini", tipoProducto: "Día", descripcion: "Sándwich caliente", stockMin: 50, precio: 4500, proveedor: "Cocina La Esquina" },
        { idProducto: 10, nombre: "Tostado", tipoProducto: "Día", descripcion: "Tostado de jamón y queso", stockMin: 50, precio: 4000, proveedor: "Panadería Panero" },
        { idProducto: 11, nombre: "Alfajor clásico", tipoProducto: "Día", descripcion: "Alfajor clásico", stockMin: 50, precio: 1500, proveedor: "Panadería Panero" },
        { idProducto: 12, nombre: "Medialuna dulce", tipoProducto: "Día", descripcion: "Medialuna dulce", stockMin: 50, precio: 1000, proveedor: "Panadería Panero" },
        { idProducto: 13, nombre: "Medialuna salada", tipoProducto: "Día", descripcion: "Medialuna salada", stockMin: 50, precio: 1100, proveedor: "Panadería Panero" },
        { idProducto: 14, nombre: "Gin Tonic", tipoProducto: "Noche", descripcion: "Gin, agua tónica y limón", stockMin: 50, precio: 11000, proveedor: "Fiesta fiesta" },
        { idProducto: 15, nombre: "Daiquiri", tipoProducto: "Noche", descripcion: "Ron, lima y azúcar", stockMin: 50, precio: 14000, proveedor: "Fiesta fiesta" }
    ];

    for (const producto of productos) {
        await prisma.producto.upsert({
            where: { idProducto: producto.idProducto },
            update: {
                nombre: producto.nombre,
                tipoProducto: producto.tipoProducto,
                descripcion: producto.descripcion,
                stockMin: producto.stockMin,
                precio: producto.precio,
                proveedor: producto.proveedor
            },
            create: producto
        });
    }
    const inventarios = [
        { sucursalId: 1, productoId: 1, stock: 100 },
        { sucursalId: 1, productoId: 2, stock: 80  },
        { sucursalId: 1, productoId: 3, stock: 50  },
        { sucursalId: 1, productoId: 4, stock: 60  },
        { sucursalId: 1, productoId: 5, stock: 60  },
        { sucursalId: 1, productoId: 6, stock: 40 },
        { sucursalId: 1, productoId: 7, stock: 50 },
        { sucursalId: 1, productoId: 8, stock: 30 },
        { sucursalId: 1, productoId: 9, stock: 25 },
        { sucursalId: 1, productoId: 10, stock: 30 },
        { sucursalId: 1, productoId: 11, stock: 40 },
        { sucursalId: 1, productoId: 12, stock: 50 },
        { sucursalId: 1, productoId: 13, stock: 50 },
        { sucursalId: 1, productoId: 14, stock: 30},
        { sucursalId: 1, productoId: 15, stock: 20},
        { sucursalId: 2, productoId: 1, stock: 80 },
        { sucursalId: 2, productoId: 2, stock: 60 },
        { sucursalId: 2, productoId: 3, stock: 40 },
        { sucursalId: 2, productoId: 4, stock: 50 },
        { sucursalId: 2, productoId: 5, stock: 50 },
        { sucursalId: 2, productoId: 6, stock: 30 },
        { sucursalId: 2, productoId: 7, stock: 40 },
        { sucursalId: 2, productoId: 8, stock: 25 },
        { sucursalId: 2, productoId: 9, stock: 20 },
        { sucursalId: 2, productoId: 10, stock: 25},
        { sucursalId: 2, productoId: 11, stock: 30 },
        { sucursalId: 2, productoId: 12, stock: 40 },
        { sucursalId: 2, productoId: 13, stock: 40 },
        { sucursalId: 2, productoId: 14, stock: 25},
        { sucursalId: 2, productoId: 15, stock: 15}
    ];


    for (const inventario of inventarios) {
        await prisma.inventario.upsert({
            where: {
                sucursalId_productoId: {
                    sucursalId: inventario.sucursalId,
                    productoId: inventario.productoId
                }
            },
            update: {
                stock: inventario.stock,
            },
            create: inventario
        });
    }
    const gastos = [
        { id: 1, fechaGasto: new Date("2026-08-01"), nombre: "Luz", costo: 180000, sucursalId: 1 },
        { id: 2, fechaGasto: new Date("2026-08-02"), nombre: "Gas", costo: 95000, sucursalId: 1 },
        { id: 3, fechaGasto: new Date("2026-08-03"), nombre: "Agua", costo: 35000, sucursalId: 1 },
        { id: 4, fechaGasto: new Date("2026-08-04"), nombre: "Internet", costo: 28000, sucursalId: 1 },
        { id: 5, fechaGasto: new Date("2026-08-05"), nombre: "Alquiler", costo: 650000, sucursalId: 1 },
        { id: 6, fechaGasto: new Date("2026-08-06"), nombre: "Limpieza", costo: 45000, sucursalId: 1 },
        { id: 7, fechaGasto: new Date("2026-08-01"), nombre: "Luz", costo: 160000, sucursalId: 2 },
        { id: 8, fechaGasto: new Date("2026-08-02"), nombre: "Gas", costo: 85000, sucursalId: 2 },
        { id: 9, fechaGasto: new Date("2026-08-03"), nombre: "Agua", costo: 30000, sucursalId: 2 },
        { id: 10, fechaGasto: new Date("2026-08-04"), nombre: "Internet", costo: 28000, sucursalId: 2 },
        { id: 11, fechaGasto: new Date("2026-08-05"), nombre: "Alquiler", costo: 600000, sucursalId: 2 },
        { id: 12, fechaGasto: new Date("2026-08-06"), nombre: "Limpieza", costo: 40000, sucursalId: 2 }
    ];

    for (const gasto of gastos) {
        await prisma.gasto.upsert({
            where: { id: gasto.id },
            update: {
                fechaGasto: gasto.fechaGasto,
                nombre: gasto.nombre,
                costo: gasto.costo,
                sucursalId: gasto.sucursalId
            },
            create: gasto
        });
    }
    const clientes = [
        { id: 1, tipo: "General", descuento: 0 },
        { id: 2, tipo: "Estudiante", descuento: 15 },
        { id: 3, tipo: "Jubilado", descuento: 20 },
        { id: 4, tipo: "General", descuento: 0 },
        { id: 5, tipo: "Estudiante", descuento: 15 }
    ];

    for (const cliente of clientes) {
        await prisma.cliente.upsert({
            where: { id: cliente.id },
            update: {
                tipo: cliente.tipo,
                descuento: cliente.descuento
            },
            create: cliente
        });
    }
    const mesas = [
        { idMesa: 1, estado: "Ocupada", maxComensales: 2 },
        { idMesa: 2, estado: "Libre", maxComensales: 2 },
        { idMesa: 3, estado: "Ocupada", maxComensales: 4 },
        { idMesa: 4, estado: "Libre", maxComensales: 4 },
        { idMesa: 5, estado: "Libre", maxComensales: 6 },
        { idMesa: 6, estado: "Libre", maxComensales: 6 },
        { idMesa: 7, estado: "Ocupada", maxComensales: 2 },
        { idMesa: 8, estado: "Libre", maxComensales: 4 },
        { idMesa: 9, estado: "Libre", maxComensales: 4 },
        { idMesa: 10, estado: "Libre", maxComensales: 6 },
    ];

    for (const mesa of mesas) {
        await prisma.mesa.upsert({
            where: { idMesa: mesa.idMesa },
            update: {
                estado: mesa.estado,
                maxComensales: mesa.maxComensales
            },
            create: mesa
        });
    }
    const tiposEmpleado = [
        { id: 1, usuario: null, contrasenia: null, tipoEmpleado: "Dueño", sueldo: 0 },
        { id: 2, usuario: null, contrasenia: null, tipoEmpleado: "Gerente", sueldo: 1200000 },
        { id: 3, usuario: null, contrasenia: null, tipoEmpleado: "Mozo", sueldo: 850000 },
        { id: 4, usuario: null, contrasenia: null, tipoEmpleado: "Ayudante de cocina", sueldo: 900000 }
    ];

    for (const tipo of tiposEmpleado) {
        await prisma.tipoEmpleado.upsert({
            where: { id: tipo.id },
            update: {
                usuario: tipo.usuario,
                contrasenia: tipo.contrasenia,
                tipoEmpleado: tipo.tipoEmpleado,
                sueldo: tipo.sueldo
            },
            create: tipo
        });
    }
    const sucursalesTipoEmpleado = [
        { sucursalId: 1, tipoEmpleadoId: 1, cantidad: 1 },
        { sucursalId: 1, tipoEmpleadoId: 2, cantidad: 1 },
        { sucursalId: 1, tipoEmpleadoId: 3, cantidad: 4 },
        { sucursalId: 1, tipoEmpleadoId: 4, cantidad: 2 },
        { sucursalId: 2, tipoEmpleadoId: 1, cantidad: 1 },
        { sucursalId: 2, tipoEmpleadoId: 2, cantidad: 1 },
        { sucursalId: 2, tipoEmpleadoId: 3, cantidad: 3 },
        { sucursalId: 2, tipoEmpleadoId: 4, cantidad: 2 }
    ];

    for (const relacion of sucursalesTipoEmpleado) {
        await prisma.sucursalTipoEmpleado.upsert({
            where: {
                sucursalId_tipoEmpleadoId: {
                    sucursalId: relacion.sucursalId,
                    tipoEmpleadoId: relacion.tipoEmpleadoId
                }
            },
            update: {
                cantidad: relacion.cantidad
            },
            create: relacion
        });
    }
    const pedidos = [
        {
            idPedido: 1,
            estadoPedido: "Pendiente",
            comensales: 2,
            mesaId: 1,
            clienteId: 1,
            sucursalId: 1,
            items: [
                { productoId: 1, cantidad: 2, subTotal: 3600 },
                { productoId: 7, cantidad: 2, subTotal: 2000 }
            ]
        },
        {
            idPedido: 2,
            estadoPedido: "En preparación",
            comensales: 4,
            mesaId: 3,
            clienteId: 2,
            sucursalId: 1,
            items: [
                { productoId: 4, cantidad: 2, subTotal: 5000 },
                { productoId: 9, cantidad: 2, subTotal: 9000 }
            ]
        },
        {
            idPedido: 3,
            estadoPedido: "Entregado",
            comensales: 2,
            mesaId: 7,
            clienteId: 3,
            sucursalId: 2,
            items: [
                { productoId: 14, cantidad: 2, subTotal: 22000 },
                { productoId: 11, cantidad: 2, subTotal: 3000 }
            ]
        },
        {
            idPedido: 4,
            estadoPedido: "Pendiente",
            comensales: 3,
            mesaId: 9,
            clienteId: 4,
            sucursalId: 2,
            items: [
                { productoId: 15, cantidad: 2, subTotal: 28000 },
                { productoId: 10, cantidad: 1, subTotal: 4000 }
            ]
        }
    ];

    for (const pedido of pedidos) {
        const { items, ...datosPedido } = pedido;

        await prisma.pedido.upsert({
            where: { idPedido: pedido.idPedido },
            update: {
                estadoPedido: datosPedido.estadoPedido,
                comensales: datosPedido.comensales,
                mesaId: datosPedido.mesaId,
                clienteId: datosPedido.clienteId,
                sucursalId: datosPedido.sucursalId
            },
            create: datosPedido
        });

        for (const item of items) {
            await prisma.itemProducto.upsert({
                where: {
                    pedidoId_productoId: {
                        pedidoId: pedido.idPedido,
                        productoId: item.productoId
                    }
                },
                update: {
                    cantidad: item.cantidad,
                    subTotal: item.subTotal
                },
                create: {
                    pedidoId: pedido.idPedido,
                    productoId: item.productoId,
                    cantidad: item.cantidad,
                    subTotal: item.subTotal
                }
            });
        }
    }

    console.log("Pedidos guardados:", await prisma.pedido.findMany({
        include: { items: true }
    }));
    console.log("Relaciones sucursal-tipo de empleado guardadas:", await prisma.sucursalTipoEmpleado.findMany());
    console.log("Tipos de empleado guardados:", await prisma.tipoEmpleado.findMany());
    console.log("Mesas guardadas:", await prisma.mesa.findMany());
    console.log("Clientes guardados:", await prisma.cliente.findMany());
    console.log("Gastos guardados:", await prisma.gasto.findMany());
    console.log("Inventarios guardados:", await prisma.inventario.findMany());
    console.log("Sucursales guardadas:", await prisma.sucursal.findMany());
    console.log("Productos guardados:", await prisma.producto.findMany());
}

main()
    .catch((error) => {
        console.error("Error al precargar datos:", error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });