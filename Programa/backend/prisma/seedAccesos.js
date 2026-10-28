require("dotenv").config();
const bcrypt = require("bcryptjs");
const prisma = require("../src/prisma");

async function main() {
    // Un usuario por rol en cada sucursal. El Dueño no tiene sucursal
    const usuarios = [
        { nombreUsuario: "duenio", contrasenia: "duenioDSW", rol: "DUENIO", sucursalId: null },
        { nombreUsuario: "gerente1", contrasenia: "gerenteDSW1", rol: "GERENTE", sucursalId: 1 },
        { nombreUsuario: "mozo1", contrasenia: "mozoDSW1", rol: "MOZO", sucursalId: 1 },
        { nombreUsuario: "cocina1", contrasenia: "cocinaDSW1", rol: "AYUDANTE_COCINA", sucursalId: 1 },
        { nombreUsuario: "gerente2", contrasenia: "gerenteDSW2", rol: "GERENTE", sucursalId: 2 },
        { nombreUsuario: "mozo2", contrasenia: "mozoDSW2", rol: "MOZO", sucursalId: 2 },
        { nombreUsuario: "cocina2", contrasenia: "cocinaDSW2", rol: "AYUDANTE_COCINA", sucursalId: 2 }
    ];

    for (const usuario of usuarios) {
        const tipo = await prisma.tipoEmpleado.findUnique({ where: { rol: usuario.rol } });

        if (!tipo) {
            throw new Error(`No existe el tipo de empleado ${usuario.rol}. Corré primero prisma/seed.js`);
        }

        const contrasenia = await bcrypt.hash(usuario.contrasenia, 12);

        await prisma.usuario.upsert({
            where: { nombreUsuario: usuario.nombreUsuario },
            update: {
                contrasenia,
                idTipoEmpleado: tipo.idTipoEmpleado,
                sucursalId: usuario.sucursalId
            },
            create: {
                nombreUsuario: usuario.nombreUsuario,
                contrasenia,
                idTipoEmpleado: tipo.idTipoEmpleado,
                sucursalId: usuario.sucursalId
            }
        });

        console.log(`Usuario preparado: ${usuario.nombreUsuario}`);
    }

    console.log("Todos los usuarios de prueba se crearon correctamente.");
}

main()
    .catch(error => {
        console.error("Error al crear los usuarios:", error.message);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });