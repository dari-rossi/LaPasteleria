import { useEffect, useState } from "react";
import { crearReserva, modificarReserva } from "../services/reservaService";

const FORMULARIO_VACIO = {
    idMesa: "",
    fechaHoraReservada: "",
    cantComensales: "",
    estadoReserva: "",
    dni: ""
};

// El backend manda la fecha en ISO (UTC); el input datetime-local necesita "YYYY-MM-DDTHH:mm" en hora local
const isoAInputFecha = (iso) => {
    const fecha = new Date(iso);
    const dos = (n) => String(n).padStart(2, "0");

    return `${fecha.getFullYear()}-${dos(fecha.getMonth() + 1)}-${dos(fecha.getDate())}T${dos(fecha.getHours())}:${dos(fecha.getMinutes())}`;
};

function ReservaForm({ reservaEditar, onReservaCreada, onReservaModificada, onCancelarEdicion }) {
    const [formulario, setFormulario] = useState(FORMULARIO_VACIO);

    const [error, setError] = useState("");

    useEffect(() => {
        if (reservaEditar) {
            setFormulario({
                idMesa: String(reservaEditar.idMesa),
                fechaHoraReservada: isoAInputFecha(reservaEditar.fechaHoraReservada),
                cantComensales: String(reservaEditar.cantComensales),
                estadoReserva: reservaEditar.estadoReserva,
                dni: reservaEditar.dni
            });
        }
    }, [reservaEditar]);

    const manejarCambio = (e) => {
        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value
        });
    };

    const manejarEnvio = async (e) => {
        e.preventDefault();
        setError("");

        try {
            if (reservaEditar) {
                // La clave (mesa + fecha y hora) no se modifica: solo se mandan los demás campos.
                // Para armar la URL se usa la fecha tal cual la devolvió el backend.
                const datos = {
                    cantComensales: Number(formulario.cantComensales),
                    estadoReserva: formulario.estadoReserva,
                    dni: formulario.dni
                };

                const reservaModificada = await modificarReserva(
                    reservaEditar.idMesa,
                    reservaEditar.fechaHoraReservada,
                    datos
                );

                onReservaModificada(reservaModificada);
            } else {
                if (!formulario.fechaHoraReservada) {
                    setError("La fecha y hora son obligatorias.");
                    return;
                }

                // Los inputs devuelven texto: el backend espera números y la fecha en ISO
                const datos = {
                    idMesa: Number(formulario.idMesa),
                    fechaHoraReservada: new Date(formulario.fechaHoraReservada).toISOString(),
                    cantComensales: Number(formulario.cantComensales),
                    estadoReserva: formulario.estadoReserva,
                    dni: formulario.dni
                };

                const nuevaReserva = await crearReserva(datos);

                onReservaCreada(nuevaReserva);
            }

            setFormulario(FORMULARIO_VACIO);
        } catch (error) {
            setError(
                error.message ||
                (reservaEditar
                    ? "No se pudo modificar la reserva."
                    : "No se pudo crear la reserva.")
            );
        }
    };

    const cancelarEdicion = () => {
        setFormulario(FORMULARIO_VACIO);
        setError("");

        onCancelarEdicion();
    };

    return (
        <div className="card mb-4">
            <div className="card-body">
                <h3 className="card-title">
                    {reservaEditar ? "Editar reserva" : "Nueva reserva"}
                </h3>

                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                <form onSubmit={manejarEnvio}>
                    <div className="mb-3">
                        <label className="form-label">ID de mesa</label>
                        <input
                            type="number"
                            min="1"
                            name="idMesa"
                            className="form-control"
                            value={formulario.idMesa}
                            onChange={manejarCambio}
                            disabled={!!reservaEditar}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Fecha y hora</label>
                        <input
                            type="datetime-local"
                            name="fechaHoraReservada"
                            className="form-control"
                            value={formulario.fechaHoraReservada}
                            onChange={manejarCambio}
                            disabled={!!reservaEditar}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Cantidad de comensales</label>
                        <input
                            type="number"
                            min="1"
                            name="cantComensales"
                            className="form-control"
                            value={formulario.cantComensales}
                            onChange={manejarCambio}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Estado de la reserva</label>
                        <input
                            type="text"
                            name="estadoReserva"
                            className="form-control"
                            value={formulario.estadoReserva}
                            onChange={manejarCambio}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">DNI</label>
                        <input
                            type="text"
                            name="dni"
                            className="form-control"
                            value={formulario.dni}
                            onChange={manejarCambio}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary me-2">
                        {reservaEditar ? "Guardar cambios" : "Crear reserva"}
                    </button>

                    {reservaEditar && (
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={cancelarEdicion}
                        >
                            Cancelar
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
}

export default ReservaForm;