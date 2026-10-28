const { randomUUID } = require("crypto");

const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
const userId = process.env.MERCADOPAGO_USER_ID;

const crearSucursal = async () => {
    const respuesta = await fetch(
        `https://api.mercadopago.com/users/${userId}/stores`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                name: "Sucursal de prueba DSW",
                external_id: "SUCURSALDSW001",
                location: {
                    street_name: "Presidente Roca",
                    street_number: "1823",
                    city_name: "Rosario",
                    state_name: "Santa Fe",
                    latitude: -32.957447802457,
                    longitude: -60.648209922692,
                    reference: "Ubicacion de referencia para TP DSW"
                }
            })
        }
    );

    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(`Error al crear sucursal: ${JSON.stringify(datos)}`);
    }

    console.log("Sucursal creada:", datos);
    return datos.id;
};

const crearCaja = async (storeId) => {
    const respuesta = await fetch(
        "https://api.mercadopago.com/v2/pos",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                "X-Idempotency-Key": randomUUID()
            },
            body: JSON.stringify({
                name: "Caja de prueba DSW",
                store_id: String(storeId),
                external_id: "CAJADSW001",
                config: {
                    qr: {
                        operating_mode: "pdv"
                    }
                }
            })
        }
    );

    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(`Error al crear caja: ${JSON.stringify(datos)}`);
    }

    console.log("Caja creada:", datos);
};

const main = async () => {
    if (!accessToken || !userId) {
        throw new Error(
            "Faltan MERCADOPAGO_ACCESS_TOKEN o MERCADOPAGO_USER_ID en .env"
        );
    }

    const storeId = await crearSucursal();
    await crearCaja(storeId);
};

main().catch(error => {
    console.error(error.message);
    process.exitCode = 1;
});
