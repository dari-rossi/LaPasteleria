const { randomUUID } = require("crypto");
const pagoRepository = require("../repositories/pago.repository");
const pedidoRepository = require("../repositories/pedido.repository");

const lanzarError = (mensaje, status) => {
    const error = new Error(mensaje);
    error.status = status;
    throw error;
};

const redondear = (valor) => Math.round((valor + Number.EPSILON) * 100) / 100;

const verificarAccesoPedido = (pedido, usuario) => {
    if (!pedido) {
        lanzarError("El pedido indicado no existe.", 404);
    }

    if (usuario.rol !== "DUENIO" &&
        Number(pedido.sucursalId) !== Number(usuario.sucursalId)) {
        lanzarError("No tenés permiso para acceder a pagos de otra sucursal.", 403);
    }
};

const calcularImporte = (pedido) => {
    if (!pedido.items || pedido.items.length === 0) {
        lanzarError("No se puede pagar un pedido sin productos.", 400);
    }

    const precio = redondear(
        pedido.items.reduce((total, item) => total + Number(item.subTotal), 0)
    );

    const tipo = String(pedido.cliente.tipo).trim().toLowerCase();
    let descuento = 0;

    if (tipo === "jubilado") {
        descuento = 20;
    } else if (tipo === "estudiante") {
        descuento = 15;
    }

    const precioFinal = redondear(precio * (1 - descuento / 100));

    return {
        precio,
        tipoDescuento: pedido.cliente.tipo,
        precioFinal
    };
};

const obtenerPagos = async (usuario) => {
    const pagos = await pagoRepository.obtenerTodos();

    if (usuario.rol === "DUENIO") {
        return pagos;
    }

    return pagos.filter(pago =>
        Number(pago.pedido.sucursalId) === Number(usuario.sucursalId)
    );
};

const obtenerPagoPorId = async (idPedido, usuario) => {
    const pedido = await pedidoRepository.obtenerPorId(idPedido);
    verificarAccesoPedido(pedido, usuario);

    const pago = await pagoRepository.obtenerPorId(idPedido);

    if (!pago) {
        lanzarError("Pago no encontrado.", 404);
    }

    return pago;
};

const crearPago = async (datos, usuario) => {
    const pedido = await pedidoRepository.obtenerPorId(datos.idPedido);
    verificarAccesoPedido(pedido, usuario);

    if (pedido.pago) {
        lanzarError("El pedido ya tiene un pago registrado.", 409);
    }

    if (datos.metodoPago === "MercadoPago") {
        lanzarError("Los pagos de Mercado Pago deben confirmarse mediante la verificación de la orden.", 400);
    }

    const importe = calcularImporte(pedido);

    return await pagoRepository.crear({
        idPedido: datos.idPedido,
        fechaHora: new Date(),
        ...importe,
        metodoPago: datos.metodoPago
    });
};

const crearQrMercadoPago = async (idPedido, usuario) => {
    const pedido = await pedidoRepository.obtenerPorId(idPedido);
    verificarAccesoPedido(pedido, usuario);

    if (pedido.pago) {
        lanzarError("El pedido ya tiene un pago registrado.", 409);
    }

    if (pedido.mercadoPagoOrderId && pedido.mercadoPagoQrData) {
        return {
            idPedido,
            orderId: pedido.mercadoPagoOrderId,
            qrData: pedido.mercadoPagoQrData,
            precio: pedido.mercadoPagoPrecio,
            tipoDescuento: pedido.mercadoPagoTipoDescuento,
            precioFinal: pedido.mercadoPagoPrecioFinal
        };
    }

    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    const externalPosId = process.env.MERCADOPAGO_POS_EXTERNAL_ID;

    if (!accessToken || !externalPosId) {
        lanzarError("Falta configurar Mercado Pago en el .env.", 500);
    }

    const importe = calcularImporte(pedido);
    const monto = importe.precioFinal.toFixed(2);

    const respuesta = await fetch("https://api.mercadopago.com/v1/orders", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            "X-Idempotency-Key": randomUUID()
        },
        body: JSON.stringify({
            type: "qr",
            total_amount: monto,
            description: `Pedido ${idPedido}`,
            external_reference: `PEDIDO-${idPedido}`,
            config: {
                qr: {
                    external_pos_id: externalPosId,
                    mode: "dynamic"
                }
            },
            transactions: {
                payments: [
                    { amount: monto }
                ]
            }
        })
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
        console.error("Error de Mercado Pago:", datos);
        lanzarError("No se pudo generar el QR de Mercado Pago.", 502);
    }

    const qrData = datos.type_response?.qr_data;

    if (!datos.id || !qrData) {
        lanzarError("Mercado Pago no devolvió el identificador de la orden o los datos del QR.", 502);
    }

    await pagoRepository.guardarOrdenMercadoPago(idPedido, {
        mercadoPagoOrderId: datos.id,
        mercadoPagoQrData: qrData,
        mercadoPagoPrecio: importe.precio,
        mercadoPagoTipoDescuento: importe.tipoDescuento,
        mercadoPagoPrecioFinal: importe.precioFinal
    });

    return {
        idPedido,
        orderId: datos.id,
        qrData,
        ...importe
    };
};

const verificarPagoMercadoPago = async (idPedido, usuario) => {
    const pedido = await pedidoRepository.obtenerPorId(idPedido);
    verificarAccesoPedido(pedido, usuario);

    if (pedido.pago) {
        return {
            estado: "pagado",
            pago: pedido.pago
        };
    }

    if (!pedido.mercadoPagoOrderId) {
        lanzarError("El pedido todavía no tiene una orden de Mercado Pago.", 400);
    }

    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

    const respuesta = await fetch(
        `https://api.mercadopago.com/v1/orders/${encodeURIComponent(pedido.mercadoPagoOrderId)}`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
    );

    const orden = await respuesta.json();

    if (!respuesta.ok) {
        console.error("Error consultando Mercado Pago:", orden);
        lanzarError("No se pudo consultar el estado del pago en Mercado Pago.", 502);
    }

    if (orden.external_reference !== `PEDIDO-${idPedido}`) {
        lanzarError("La orden de Mercado Pago no corresponde a este pedido.", 409);
    }

    if (orden.status !== "processed") {
        return {
            estado: orden.status || "pendiente",
            mensaje: "El pago todavía no está confirmado."
        };
    }

    if (redondear(Number(orden.total_amount)) !==
        redondear(Number(pedido.mercadoPagoPrecioFinal))) {
        lanzarError("El importe confirmado no coincide con el importe del pedido.", 409);
    }

    const importe = {
        precio: pedido.mercadoPagoPrecio,
        tipoDescuento: pedido.mercadoPagoTipoDescuento,
        precioFinal: pedido.mercadoPagoPrecioFinal
    };

    try {
        const pago = await pagoRepository.crear({
            idPedido,
            fechaHora: new Date(),
            ...importe,
            metodoPago: "MercadoPago"
        });

        return {
            estado: "pagado",
            pago
        };
    } catch (error) {
        // La clave primaria de Pago impide registrar dos pagos para el mismo pedido.
        if (error.code === "P2002") {
            const pagoExistente = await pagoRepository.obtenerPorId(idPedido);

            if (pagoExistente) {
                return {
                    estado: "pagado",
                    pago: pagoExistente
                };
            }
        }

        throw error;
    }
};

module.exports = {
    obtenerPagos,
    obtenerPagoPorId,
    crearPago,
    crearQrMercadoPago,
    verificarPagoMercadoPago
};