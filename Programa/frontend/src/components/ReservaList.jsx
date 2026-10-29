import { useEffect, useState } from "react";
import { obtenerReservas, modificarReserva } from "../services/reservaService";
import { ESTADOS_RESERVA, COLORES_ESTADO_RESERVA, formatearFechaHora } from "../models/Reserva";

function ReservaList() {
    const [reservas, setReservas] = useState([]);
    const [error, setError] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("");

    useEffect(() => {
        cargarReservas();
    }, []);

    const cargarReservas = async () => {
        try {
            setReservas(await obtenerReservas());
            setError("");
        } catch (error) {
            setError("No se pudieron cargar las reservas.");
        }
    };

    const cancelarReserva = async (reserva) => {
    if (!window.confirm("¿Cancelar esta reserva? El horario queda libre.")) {
        return;
    }

    try {
        await modificarReserva(reserva.idMesa, reserva.fechaHoraReservada, {
            cantComensales: reserva.cantComensales,
            estadoReserva: "Cancelada",
            dni: reserva.dni
        });
        await cargarReservas();
    } catch (error) {
        setError(error.message || "No se pudo cancelar la reserva.");
    }
};

    const reservasVisibles = reservas
        .filter((reserva) => !filtroEstado || reserva.estadoReserva === filtroEstado)
        .sort((a, b) => new Date(b.fechaHoraReservada) - new Date(a.fechaHoraReservada));

    return (
        <div>
            <h2 className="mb-3">Reservas</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="d-flex align-items-center gap-2 mb-3">
                <select
                    className="form-select w-auto"
                    value={filtroEstado}
                    onChange={(e) => setFiltroEstado(e.target.value)}
                >
                    <option value="">Todos los estados</option>
                    {ESTADOS_RESERVA.map((estado) => (
                        <option key={estado} value={estado}>{estado}</option>
                    ))}
                </select>

                <button className="btn btn-outline-secondary" onClick={cargarReservas}>
                    Refrescar
                </button>

                <span className="text-muted ms-2">
                    {reservasVisibles.length} reserva(s)
                </span>
            </div>

            {reservasVisibles.length === 0 && !error ? (
                <p>No hay reservas para mostrar.</p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped table-bordered align-middle">
                        <thead>
                            <tr>
                                <th>Mesa</th>
                                <th>Fecha y hora</th>
                                <th>Comensales</th>
                                <th>Estado</th>
                                <th>DNI</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {reservasVisibles.map((reserva) => (
                                <tr key={`${reserva.idMesa}-${reserva.fechaHoraReservada}`}>
                                    <td>{reserva.idMesa}</td>
                                    <td>{formatearFechaHora(reserva.fechaHoraReservada)}</td>
                                    <td>{reserva.cantComensales}</td>
                                    <td>
                                        <span className={`badge ${COLORES_ESTADO_RESERVA[reserva.estadoReserva]}`}>
                                            {reserva.estadoReserva}
                                        </span>
                                    </td>
                                    <td>{reserva.dni}</td>
                                    <td>
                                        {reserva.estadoReserva === "Activa" && (
                                            <button
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() => cancelarReserva(reserva)}
                                            >
                                                Cancelar
                                            </button>
                                        )}
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

export default ReservaList;