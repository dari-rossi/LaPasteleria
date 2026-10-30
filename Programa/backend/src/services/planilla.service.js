const planillaRepository = require("../repositories/planilla.repository");
const {
    hoy,
    mesActual,
    rangoDelDia,
    rangoDelMes
} = require("../config/fechas");
const { lanzarError } = require("../config/errores");

const redondear = (valor) =>
    Math.round((valor + Number.EPSILON) * 100) / 100;

// Determina qué sucursal puede consultar el usuario.
const resolverSucursal = (sucursalIdPedida, usuario) => {
    const sucursalId = usuario.rol === "DUENIO"
        ? Number(sucursalIdPedida)
        : Number(usuario.sucursalId);

    if (!Number.isInteger(sucursalId) || sucursalId <= 0) {
        lanzarError("SUCURSAL_REQUERIDA");
    }

    return sucursalId;
};

// Elige el elemento con mayor valor.
// Si hay empate, se elige el de menor ID.
const elegirMayor = (elementos, campo, campoId) => {
    let elegido = null;

    for (const elemento of elementos) {
        if (
            !elegido ||
            elemento[campo] > elegido[campo] ||
            (
                elemento[campo] === elegido[campo] &&
                elemento[campoId] < elegido[campoId]
            )
        ) {
            elegido = elemento;
        }
    }

    return elegido;
};

// Calcula el producto más vendido por cantidad de unidades.
const calcularProductoEstrella = (pagos) => {
    const unidades = new Map();

    for (const pago of pagos) {
        for (const item of pago.pedido.items) {
            const actual = unidades.get(item.productoId) ?? {
                idProducto: item.productoId,
                nombre: item.producto.nombre,
                cantidad: 0
            };

            actual.cantidad += item.cantidad;
            unidades.set(item.productoId, actual);
        }
    }

    return elegirMayor(unidades.values(), "cantidad", "idProducto");
};

// Calcula los datos compartidos por la planilla diaria y mensual.
const calcularResumen = (pagos) => {
    const ventas = pagos.length;

    const totalClientes = pagos.reduce(
        (total, pago) => total + pago.pedido.comensales,
        0
    );

    const montoTotal = redondear(
        pagos.reduce((total, pago) => total + pago.precioFinal, 0)
    );

    return {
        ventas,
        totalClientes,
        montoPromedioPorVenta: ventas > 0
            ? redondear(montoTotal / ventas)
            : 0,
        montoPromedioPorPersona: totalClientes > 0
            ? redondear(montoTotal / totalClientes)
            : 0,
        productoEstrella: calcularProductoEstrella(pagos),
        montoTotal
    };
};

// Obtiene la planilla diaria de una sucursal.
const obtenerPlanillaDiaria = async (fecha, usuario, sucursalIdPedida) => {
    const dia = fecha ?? hoy();
    const { desde, hasta } = rangoDelDia(dia);
    const sucursalId = resolverSucursal(sucursalIdPedida, usuario);

    const pagos = await planillaRepository.obtenerPagosDelPeriodo(
        desde,
        hasta,
        sucursalId
    );

    return {
        fecha: dia,
        sucursalId,
        ...calcularResumen(pagos)
    };
};

// Obtiene la planilla mensual de una sucursal.
const obtenerPlanillaMensual = async (mes, usuario, sucursalIdPedida) => {
    const periodo = mes ?? mesActual();
    const { desde, hasta } = rangoDelMes(periodo);
    const sucursalId = resolverSucursal(sucursalIdPedida, usuario);

    const pagos = await planillaRepository.obtenerPagosDelPeriodo(
        desde,
        hasta,
        sucursalId
    );

    return {
        mes: periodo,
        sucursalId,
        ...calcularResumen(pagos)
    };
};

// Obtiene la planilla general del mes actual, considerando todas las sucursales.
const obtenerPlanillaGeneral = async () => {
    const mes = mesActual();
    const { desde, hasta } = rangoDelMes(mes);

    const pagos = await planillaRepository.obtenerPagosDelPeriodo(
        desde,
        hasta
    );

    const porSucursal = new Map();

    for (const pago of pagos) {
        const { sucursalId, comensales } = pago.pedido;

        const actual = porSucursal.get(sucursalId) ?? {
            sucursalId,
            comensales: 0,
            recaudacion: 0
        };

        actual.comensales += comensales;
        actual.recaudacion += pago.precioFinal;

        porSucursal.set(sucursalId, actual);
    }

    const masConcurrida = elegirMayor(
        porSucursal.values(),
        "comensales",
        "sucursalId"
    );

    const mayorRecaudacion = elegirMayor(
        porSucursal.values(),
        "recaudacion",
        "sucursalId"
    );

    return {
        mes,
        productoEstrella: calcularProductoEstrella(pagos),
        sucursalMasConcurrida: masConcurrida
            ? {
                sucursalId: masConcurrida.sucursalId,
                comensales: masConcurrida.comensales
            }
            : null,
        sucursalMayorRecaudacion: mayorRecaudacion
            ? {
                sucursalId: mayorRecaudacion.sucursalId,
                recaudacion: redondear(mayorRecaudacion.recaudacion)
            }
            : null
    };
};

module.exports = {
    obtenerPlanillaDiaria,
    obtenerPlanillaMensual,
    obtenerPlanillaGeneral
};