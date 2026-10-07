import { useState } from "react";
import { crearPago } from "../services/pagoService";

function PagoForm({ onPagoCreado }) {
    const [formulario, setFormulario] = useState({
        idPedido: "",
        metodoPago: ""
    });

    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);

    const manejarCambio = (e) => {
        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value
        });
    };

    const manejarEnvio = async (e) => {
        e.preventDefault();
        setError("");

        if (!formulario.idPedido || !formulario.metodoPago) {
            setError("Complete todos los campos.");
            return;
        }

        setCargando(true);

        try {
            const nuevoPago = await crearPago({
                idPedido: Number(formulario.idPedido),
                metodoPago: formulario.metodoPago
            });

            onPagoCreado(nuevoPago);

            setFormulario({
                idPedido: "",
                metodoPago: ""
            });
        } catch (error) {
            console.error("ERROR:", error);
            setError(error.message || "No se pudo registrar el pago.");
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="card mb-4 shadow-sm">
            <div className="card-body">
                <h3 className="card-title mb-1">Registrar pago</h3>

                <p className="text-muted mb-4">
                    Ingrese el pedido y el método de pago. El importe y el
                    descuento se calculan automáticamente.
                </p>

                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                <form onSubmit={manejarEnvio}>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">
                                Número de pedido
                            </label>

                            <input
                                type="number"
                                name="idPedido"
                                className="form-control"
                                min="1"
                                value={formulario.idPedido}
                                onChange={manejarCambio}
                                placeholder="Ej. 15"
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label className="form-label">
                                Método de pago
                            </label>

                            <select
                                name="metodoPago"
                                className="form-select"
                                value={formulario.metodoPago}
                                onChange={manejarCambio}
                            >
                                <option value="">
                                    Seleccione un método
                                </option>
                                <option value="Efectivo">
                                    Efectivo
                                </option>
                                <option value="Tarjeta">
                                    Tarjeta
                                </option>
                                <option value="Transferencia">
                                    Transferencia
                                </option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={cargando}
                    >
                        {cargando ? "Registrando..." : "Registrar pago"}
                    </button>
                </form>

                <div className="alert alert-light border mt-4 mb-0">
                    <small className="text-muted">
                        Una vez registrado, el pago no puede modificarse ni
                        eliminarse.
                    </small>
                </div>
            </div>
        </div>
    );
}

export default PagoForm;