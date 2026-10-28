const ZONA = "America/Argentina/Buenos_Aires";

const horaActual = (fecha = new Date()) =>
    Number(new Intl.DateTimeFormat("en-GB", {
        timeZone: ZONA,
        hour: "2-digit",
        hourCycle: "h23"
    }).format(fecha));

// Día: 7:00 a 20:00 | Noche: 20:00 a 3:00 | Ambos: siempre
// Entre las 3:00 y las 7:00 solo se pueden vender productos "Ambos"
const productoDisponibleAhora = (tipoProducto, fecha = new Date()) => {
    const hora = horaActual(fecha);

    if (tipoProducto === "Día") return hora >= 7 && hora < 20;
    if (tipoProducto === "Noche") return hora >= 20 || hora < 3;
    return true;
};

const mensajeHorario = (tipoProducto) =>
    tipoProducto === "Día"
        ? "Los productos de día solo se pueden vender de 7:00 a 20:00."
        : "Los productos de noche solo se pueden vender de 20:00 a 3:00.";

module.exports = { productoDisponibleAhora, mensajeHorario };