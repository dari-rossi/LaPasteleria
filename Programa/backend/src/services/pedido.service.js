const pedidoRepository = require("../repositories/pedido.repository");
const mesaRepository = require("../repositories/mesa.repository");
const clienteRepository = require("../repositories/cliente.repository");
const sucursalRepository = require("../repositories/sucursal.repository");
const productoRepository = require("../repositories/producto.repository");
const { ESTADO_INICIAL, ESTADOS_FINALES } = require("../config/estadosPedido");
const { lanzarError } = require("../config/errores");

const redondear = (valor) => Math.round(valor * 100) / 100;

// El pedido tiene que existir y ser de la sucursal del usuario
const verificarAccesoPedido = (pedido, usuario) => {
    if (!pedido) {
        lanzarError("PEDIDO_NO_ENCONTRADO");
    }
    if (usuario.rol !== "DUENIO" &&
        Number(pedido.sucursalId) !== Number(usuario.sucursalId)) {
        lanzarError("OTRA_SUCURSAL");
    }
};

// Busca un pedido, controla el acceso y lo devuelve (o lanza 404 / 403)
const buscarPedido = async (id, usuario) => {
    const pedido = await pedidoRepository.obtenerPorId(id);

    verificarAccesoPedido(pedido, usuario);

    return pedido;
};

const obtenerPedidos = async (usuario, sucursalId) => {
    if (usuario.rol === "DUENIO" && !sucursalId) {
        lanzarError("Debés indicar una sucursal", 400);
    }
    
    const sucursalFiltro = usuario.rol === "DUENIO"
        ? sucursalId
        : usuario.sucursalId;

    const pedidos = await pedidoRepository.obtenerTodos();

    return pedidos.filter(pedido =>
        Number(pedido.sucursalId) === Number(sucursalFiltro)
    );
};

const obtenerPedidoPorId = async (id, usuario) => {
    return await buscarPedido(id, usuario);
};

// Un pedido siempre tiene una mesa, un cliente y una sucursal. Los productos pueden venir ahora o cargarse después
const crearPedido = async (datos, usuario) => {
    const mesa = await mesaRepository.obtenerPorId(datos.mesaId);

    if (!mesa) {
        lanzarError("MESA_NO_ENCONTRADA");
    }

    if (mesa.estado === "Ocupada") {
        lanzarError("La mesa ya está ocupada.", 409);
    }

    if (datos.comensales > mesa.maxComensales) {
        lanzarError(`La mesa admite hasta ${mesa.maxComensales} comensales.`, 400);
    }

    const cliente = await clienteRepository.obtenerPorId(datos.clienteId);

    if (!cliente) {
        lanzarError("CLIENTE_NO_ENCONTRADO");
    }

    const sucursal = await sucursalRepository.obtenerPorId(datos.sucursalId);

    if (!sucursal) {
        lanzarError("SUCURSAL_NO_ENCONTRADA");
    }

    if (Number(datos.sucursalId) !== Number(usuario.sucursalId)) {
        lanzarError("OTRA_SUCURSAL");
    }

    // Se arma cada item con su subTotal (cantidad * precio del producto)
    const items = [];

    for (const item of datos.items ?? []) {
        const producto = await productoRepository.obtenerPorId(item.productoId);

        if (!producto) {
            lanzarError("PRODUCTO_NO_ENCONTRADO", `El producto ${item.productoId} no existe`);
        }

        items.push({
            productoId: item.productoId,
            cantidad: item.cantidad,
            subTotal: redondear(item.cantidad * producto.precio)
        });
    }

    const nuevoPedidoData = {
        estadoPedido: ESTADO_INICIAL,
        comensales: datos.comensales,
        mesaId: datos.mesaId,
        clienteId: datos.clienteId,
        sucursalId: datos.sucursalId
    };

    if (items.length > 0) {
        nuevoPedidoData.items = { create: items };
    }

    return await pedidoRepository.crearOcupandoMesa(nuevoPedidoData);
};

// Solo se modifican el estado y los comensales; los productos se manejan desde itemProducto.
const modificarPedido = async (id, datos, usuario) => {
    await buscarPedido(id, usuario);
    const pedido = await buscarPedido(id, usuario);
    if (ESTADOS_FINALES.includes(pedido.estadoPedido)) {
        lanzarError(`Un pedido ${pedido.estadoPedido.toLowerCase()} no se puede modificar.`, 409);
    }

    if (datos.estadoPedido === "Pagado") {
        lanzarError("Para pagar el pedido hay que registrar el pago.", 400);
    }

    if (datos.comensales !== undefined &&
        datos.comensales > pedido.mesa.maxComensales) {
        lanzarError(`La mesa admite hasta ${pedido.mesa.maxComensales} comensales.`, 400);
    }

    if (datos.estadoPedido === "Cancelado") {
        return await pedidoRepository.cancelarDevolviendoStock(id);
    }

    return await pedidoRepository.modificar(id, datos);
};

const eliminarPedido = async (id, usuario) => {
    const pedido = await buscarPedido(id, usuario);

    if (pedido.pago) {
        lanzarError("PEDIDO_CON_PAGO");
    }

    if (!ESTADOS_FINALES.includes(pedido.estadoPedido)) {
        await pedidoRepository.cancelarDevolviendoStock(id);
    }

    return await pedidoRepository.eliminar(id);
};

module.exports = {
    obtenerPedidos,
    obtenerPedidoPorId,
    crearPedido,
    modificarPedido,
    eliminarPedido
};