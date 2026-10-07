import { useEffect, useState } from "react";
import { obtenerPagos } from "../services/pagoService";
import PagoForm from "./PagoForm";

function PagoList() {
    const [pagos, setPagos] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        cargarPagos();
    }, []);

    const cargarPagos = async () => {
        try {
            const datos = await obtenerPagos();
            setPagos(datos);
        } catch (error) {
            console.error("ERROR:", error);
            setError("No se pudieron cargar los pagos.");
        }
    };

    const agregarPago = (nuevoPago) => {
        setPagos([...pagos, nuevoPago]);
    };

    const formatearFecha = (fecha) => {
        if (!fecha) {
            return "-";
        }

        return new Date(fecha).toLocaleString("es-AR");
    };

    const obtenerClaseMetodo = (metodo) => {
        if (metodo === "Efectivo") {
            return "badge text-bg-success";
        }

        if (metodo === "Tarjeta") {
            return "badge text-bg-primary";
        }

        return "badge text-bg-info";
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h2 className="mb-1">Pagos</h2>
                    <p className="text-muted mb-0">
                        Registro de pagos realizados
                    </p>
                </div>
            </div>

            <PagoForm onPagoCreado={agregarPago} />

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {pagos.length === 0 && !error ? (
                <div className="alert alert-light border">
                    No hay pagos registrados.
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Pedido</th>
                                <th>Fecha y hora</th>
                                <th>Precio</th>
                                <th>Descuento</th>
                                <th>Método</th>
                                <th>Total pagado</th>
                            </tr>
                        </thead>

                        <tbody>
                            {pagos.map((pago) => (
                                <tr key={pago.idPedido}>
                                    <td>
                                        <strong>#{pago.idPedido}</strong>
                                    </td>

                                    <td>
                                        {formatearFecha(pago.fechaHora)}
                                    </td>

                                    <td>
                                        ${Number(pago.precio).toLocaleString("es-AR")}
                                    </td>

                                    <td>
                                        {pago.tipoDescuento}
                                    </td>

                                    <td>
                                        <span
                                            className={obtenerClaseMetodo(
                                                pago.metodoPago
                                            )}
                                        >
                                            {pago.metodoPago}
                                        </span>
                                    </td>

                                    <td>
                                        <strong>
                                            $
                                            {Number(
                                                pago.precioFinal
                                            ).toLocaleString("es-AR")}
                                        </strong>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default PagoList;