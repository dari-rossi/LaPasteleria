const planillaRepository = require("../repositories/planilla.repository");
const { hoy, mesActual, rangoDelDia, rangoDelMes } = require("../config/fechas");
const { lanzarError } = require("../config/errores");
const redondear = (valor) => Math.round((valor + Number.EPSILON) * 100) / 100;


const resolverSucursal = (sucursalIdPedida, usuario) => {
    if (usuario.rol !== "DUENIO") {
        return usuario.sucursalId;
    }

    const sucursalId = Number(sucursalIdPedida);

    if (!Number.isInteger(sucursalId) || sucursalId <= 0) {
        lanzarError("SUCURSAL_REQUERIDA");
    }

    return sucursalId;
};

// Elige el elemento con mayor valor en "campo"; si empatan, el de menor ID
const elegirMayor = (elementos, campo, campoId) => {
    let elegido = null;

    for (const elemento of elementos) {
        if (!elegido ||
            elemento[campo] > elegido[campo] ||
            (elemento[campo] === elegido[campo] && elemento[campoId] < elegido[campoId])) {
            elegido = elemento;
        }
    }

    return elegido;
};

// El producto más vendido por cantidad de unidades (null si no hubo ventas)
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

// Los datos que tienen en común la planilla diaria y la mensual
const calcularResumen = (pagos) => {
    const ventas = pagos.length;
    const totalClientes = pagos.reduce((total, pago) => total + pago.pedido.comensales, 0);
    const montoTotal = redondear(pagos.reduce((total, pago) => total + pago.precioFinal, 0));

    return {
        ventas,
        totalClientes,
        montoPromedioPorVenta: ventas > 0 ? redondear(montoTotal / ventas) : 0,
        montoPromedioPorPersona: totalClientes > 0 ? redondear(montoTotal / totalClientes) : 0,
        productoEstrella: calcularProductoEstrella(pagos),
        montoTotal
    };
};

// Planilla de un día (AAAA-MM-DD) de una sucursal. Sin fecha, es la de hoy
const obtenerPlanillaDiaria = async (fecha, usuario, sucursalIdPedida) => {
    const dia = fecha ?? hoy();
    const { desde, hasta } = rangoDelDia(dia);
    const sucursalId = resolverSucursal(sucursalIdPedida, usuario);

    const pagos = await planillaRepository.obtenerPagosDelPeriodo(desde, hasta, sucursalId);

    return { fecha: dia, sucursalId, ...calcularResumen(pagos) };
};

// Planilla de un mes (AAAA-MM) de una sucursal. Sin mes, es la del mes actual
const obtenerPlanillaMensual = async (mes, usuario, sucursalIdPedida) => {
    const periodo = mes ?? mesActual();
    const { desde, hasta } = rangoDelMes(periodo);
    const sucursalId = resolverSucursal(sucursalIdPedida, usuario);

    const pagos = await planillaRepository.obtenerPagosDelPeriodo(desde, hasta, sucursalId);

    return { mes: periodo, sucursalId, ...calcularResumen(pagos) };
};

// Planilla general del mes actual, sumando todas las sucursales
const obtenerPlanillaGeneral = async () => {
    const mes = mesActual();
    const { desde, hasta } = rangoDelMes(mes);

    const pagos = await planillaRepository.obtenerPagosDelPeriodo(desde, hasta);

    const porSucursal = new Map();

    for (const pago of pagos) {
        const { sucursalId, comensales } = pago.pedido;
        const actual = porSucursal.get(sucursalId) ?? { sucursalId, comensales: 0, recaudacion: 0 };

        actual.comensales += comensales;
        actual.recaudacion += pago.precioFinal;
        porSucursal.set(sucursalId, actual);
    }

    const masConcurrida = elegirMayor(porSucursal.values(), "comensales", "sucursalId");
    const mayorRecaudacion = elegirMayor(porSucursal.values(), "recaudacion", "sucursalId");

    return {
        mes,
        productoEstrella: calcularProductoEstrella(pagos),
        sucursalMasConcurrida: masConcurrida
            ? { sucursalId: masConcurrida.sucursalId, comensales: masConcurrida.comensales }
            : null,
        sucursalMayorRecaudacion: mayorRecaudacion
            ? { sucursalId: mayorRecaudacion.sucursalId, recaudacion: redondear(mayorRecaudacion.recaudacion) }
            : null
    };
};

module.exports = {
    obtenerPlanillaDiaria,
    obtenerPlanillaMensual,
    obtenerPlanillaGeneral
};