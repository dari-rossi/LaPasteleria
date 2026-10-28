require("dotenv").config();
const bcrypt = require("bcryptjs");
const prisma = require("../src/prisma");

async function main() {
    const cuentas = [
        { usuario: "duenio", contrasenia: "duenioDSW", rol: "DUENIO", sucursalId: null },
        { usuario: "gerente1", contrasenia: "gerenteDSW1", rol: "GERENTE", sucursalId: 1 },
        { usuario: "mozo1", contrasenia: "mozoDSW1", rol: "MOZO", sucursalId: 1 },
        { usuario: "cocina1", contrasenia: "cocinaDSW1", rol: "AYUDANTE_COCINA", sucursalId: 1 },
        { usuario: "gerente2", contrasenia: "gerenteDSW2", rol: "GERENTE", sucursalId: 2 },
        { usuario: "mozo2", contrasenia: "mozoDSW2", rol: "MOZO", sucursalId: 2 },
        { usuario: "cocina2", contrasenia: "cocinaDSW2", rol: "AYUDANTE_COCINA", sucursalId: 2 }
    ];

    for (const cuenta of cuentas) {
        const contraseniaHash = await bcrypt.hash(cuenta.contrasenia, 12);

        await prisma.cuentaAcceso.upsert({
            where: { usuario: cuenta.usuario },
            update: {
                contraseniaHash,
                rol: cuenta.rol,
                sucursalId: cuenta.sucursalId
            },
            create: {
                usuario: cuenta.usuario,
                contraseniaHash,
                rol: cuenta.rol,
                sucursalId: cuenta.sucursalId
            }
        });

        console.log(`Cuenta preparada: ${cuenta.usuario}`);
    }

    console.log("Todas las cuentas de prueba se crearon correctamente.");
}

main()
    .catch(error => {
        console.error("Error al crear las cuentas:", error.message);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
