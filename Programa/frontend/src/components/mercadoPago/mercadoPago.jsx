import { useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { apiFetch } from "../../services/api";
import "./MercadoPago.css";

const MercadoPago = ({ pedidoId, onPagoConfirmado }) => {
    const [orden, setOrden] = useState(null);
    const [estado, setEstado] = useState("");
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState("");

    const consultaEnCurso = useRef(false);
    const confirmacionProcesada = useRef(false);
    const callbackRef = useRef(onPagoConfirmado);

    useEffect(() => {
        callbackRef.current = onPagoConfirmado;
    }, [onPagoConfirmado]);

    const generarQR = async () => {
        setCargando(true);
        setError("");

        try {
            const respuesta = await apiFetch(
                `/pagos/mercadopago/${pedidoId}/qr`,
                { method: "POST" }
            );

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(datos.error || "No se pudo generar el QR.");
            }

            setOrden(datos);
            setEstado("created");
            confirmacionProcesada.current = false;
        } catch (error) {
            setError(error.message);
        } finally {
            setCargando(false);
        }
    };

    const consultarEstado = async (automatico = false) => {
        if (consultaEnCurso.current || confirmacionProcesada.current) {
            return;
        }

        consultaEnCurso.current = true;

        if (!automatico) {
            setCargando(true);
            setError("");
        }

        try {
            const respuesta = await apiFetch(
                `/pagos/mercadopago/${pedidoId}/estado`
            );

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                if (!automatico) {
                    throw new Error(datos.error || "No se pudo consultar el pago.");
                }
                return;
            }

            setEstado(datos.estado);

            if (datos.estado === "pagado") {
                confirmacionProcesada.current = true;

                setOrden((anterior) => ({
                    ...anterior,
                    pago: datos.pago
                }));

                if (callbackRef.current) {
                    await callbackRef.current();
                }
            }
        } catch (error) {
            if (!automatico) {
                setError(error.message);
            }
        } finally {
            consultaEnCurso.current = false;

            if (!automatico) {
                setCargando(false);
            }
        }
    };

    useEffect(() => {
        if (!orden || estado === "pagado") {
            return;
        }

        const intervalo = setInterval(() => {
            consultarEstado(true);
        }, 5000);

        return () => clearInterval(intervalo);
    }, [orden, estado, pedidoId]);

    const formatoPrecio = (precio) =>
        new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            maximumFractionDigits: 2
        }).format(precio);

    return (
        <section className="mercado-pago">
            <h2>Pago con Mercado Pago</h2>
            <p>Pedido #{pedidoId}</p>

            {!orden && (
                <button type="button" onClick={generarQR} disabled={cargando}>
                    {cargando ? "Generando QR..." : "Generar QR"}
                </button>
            )}

            {orden && (
                <>
                    {estado === "pagado" ? (
                        <div className="mp-exito">
                            <h3>¡Pago confirmado!</h3>
                            <p>El pedido fue pagado correctamente.</p>
                        </div>
                    ) : (
                        <>
                            <div className="mp-qr">
                                <QRCodeSVG
                                    value={orden.qrData}
                                    size={240}
                                    level="M"
                                    includeMargin
                                />
                            </div>

                            <p>
                                Escaneá el QR con la aplicación de Mercado Pago
                                y completá el pago.
                            </p>

                            <div className="mp-importes">
                                <p>Subtotal: {formatoPrecio(orden.precio)}</p>
                                <p>
                                    Descuento:{" "}
                                    {formatoPrecio(orden.precio - orden.precioFinal)}
                                </p>
                                <h3>Total: {formatoPrecio(orden.precioFinal)}</h3>
                            </div>

                            <p>
                                Estado:{" "}
                                {estado === "created"
                                    ? "Esperando el pago"
                                    : estado}
                            </p>

                            <p>
                                Estamos verificando automáticamente el estado
                                del pago.
                            </p>

                            <button
                                type="button"
                                onClick={() => consultarEstado()}
                                disabled={cargando}
                            >
                                {cargando
                                    ? "Consultando..."
                                    : "Consultar estado ahora"}
                            </button>
                        </>
                    )}
                </>
            )}

            {error && (
                <p className="mp-error" role="alert">
                    {error}
                </p>
            )}
        </section>
    );
};

export default MercadoPago;