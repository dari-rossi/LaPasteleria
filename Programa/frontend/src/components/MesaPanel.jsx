import { useEffect, useState } from "react";
import ReservaMesaForm from "./ReservaMesaForm";

function MesaPanel({ mesa, clientes, onEmpezarPedido, onReservaCreada, onEditar, onEliminar, onCerrar }) {
    const [clienteId, setClienteId] = useState("");
    const [comensales, setComensales] = useState("");
    const [error, setError] = useState("");
    const [vista, setVista] = useState("opciones"); // "opciones" | "reservar"
    const [mensaje, setMensaje] = useState("");

    // Al cambiar de mesa se limpia el panel
    useEffect(() => {
        setClienteId("");
        setComensales("");
        setError("");
        setVista("opciones");
        setMensaje("");
    }, [mesa.idMesa]);

    const empezar = async () => {
        setError("");
        setMensaje("");

        if (!clienteId) {
            setError("Elegí un cliente.");
            return;
        }

        const cantidad = Number(comensales);

        if (!Number.isInteger(cantidad) || cantidad < 1) {
            setError("Ingresá la cantidad de comensales.");
            return;
        }
        if (cantidad > mesa.maxComensales) {
            setError(`Esta mesa admite hasta ${mesa.maxComensales} comensales.`);
            return;
        }

        try {
            await onEmpezarPedido(cantidad, Number(clienteId));
        } catch (e) {
            setError(e.message || "No se pudo empezar el pedido.");
        }
    };

    const ocupada = mesa.estado === "Ocupada";
    const sinClientes = clientes.length === 0;

    // Vista de reserva: reemplaza las opciones mientras se completa el formulario
    if (vista === "reservar") {
        return (
            <div className="card">
                <div className="card-body">
                    <h4 className="card-title">Reservar mesa {mesa.idMesa}</h4>

                    <ReservaMesaForm
                        mesa={mesa}
                        onGuardada={() => {
                            setVista("opciones");
                            setMensaje("Reserva creada.");
                            if (onReservaCreada) onReservaCreada();
                        }}
                        onCancelar={() => setVista("opciones")}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="card">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                    <h4 className="card-title">Mesa {mesa.idMesa}</h4>
                    <button className="btn-close" onClick={onCerrar} aria-label="Cerrar" />
                </div>

                <p className="text-muted">
                    {mesa.estado} · hasta {mesa.maxComensales} comensales
                </p>

                {error && <div className="alert alert-danger py-2">{error}</div>}

                {mensaje && <div className="alert alert-success py-2">{mensaje}</div>}

                {sinClientes && (
                    <div className="alert alert-warning py-2">
                        No hay clientes cargados. Cargá uno en Administración para poder empezar un pedido.
                    </div>
                )}

                <label className="form-label">Cliente</label>
                <select
                    className="form-select mb-2"
                    value={clienteId}
                    onChange={(e) => setClienteId(e.target.value)}
                    disabled={ocupada || sinClientes}
                >
                    <option value="">Seleccione un cliente</option>
                    {clientes.map((cliente) => (
                        <option key={cliente.id} value={cliente.id}>
                            #{cliente.id} · {cliente.tipo} ({cliente.descuento ?? 0}% desc.)
                        </option>
                    ))}
                </select>

                <label className="form-label">Cantidad de comensales</label>
                <input
                    type="number"
                    min="1"
                    max={mesa.maxComensales}
                    className="form-control mb-2"
                    value={comensales}
                    onChange={(e) => setComensales(e.target.value)}
                    disabled={ocupada}
                />

                <button
                    className="btn btn-success w-100 mb-2"
                    onClick={empezar}
                    disabled={ocupada || sinClientes}
                >
                    Empezar pedido
                </button>

                <button
                    className="btn btn-warning w-100 mb-2"
                    onClick={() => {
                        setError("");
                        setMensaje("");
                        setVista("reservar");
                    }}
                >
                    Reservar
                </button>

                <button className="btn btn-outline-primary w-100 mb-2" onClick={onEditar}>
                    Editar
                </button>

                <button className="btn btn-outline-danger w-100" onClick={onEliminar}>
                    Eliminar
                </button>
            </div>
        </div>
    );
}

export default MesaPanel;