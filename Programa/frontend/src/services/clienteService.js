const API_URL = "http://localhost:3000/clientes";

export const obtenerClientes = async () => {
    const response = await fetch(API_URL);

    const datos = await response.json();

    console.log("CLIENTES RECIBIDOS:", datos);

    if (!response.ok) {
        throw new Error("No se pudieron obtener los clientes");
    }

    return datos;
};

export const crearCliente = async (cliente) => {
    console.log("CLIENTE QUE SE ENVIA:", cliente);

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(cliente)
    });

    const datos = await response.json();

    console.log("RESPUESTA DEL SERVIDOR:", datos);

    if (!response.ok) {
        throw new Error(
            datos.detalles
                ? datos.detalles.map((detalle) => detalle.message).join(". ")
                : datos.error
        );
    }

    return datos;
};

export const modificarCliente = async (id, cliente) => {
    console.log("CLIENTE QUE SE MODIFICA:", cliente);

    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(cliente)
    });

    const datos = await response.json();

    if (!response.ok) {
        throw new Error(
            datos.detalles
                ? datos.detalles.map((detalle) => detalle.message).join(". ")
                : datos.error
        );
    }

    return datos;
};

export const eliminarCliente = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {method: "DELETE"});

    if (!response.ok) {
        throw new Error("No se pudo eliminar el cliente");
    }

    return await response.json();
};