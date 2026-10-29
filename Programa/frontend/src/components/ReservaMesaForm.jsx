import { useState } from "react";
import { crearReserva } from "../services/reservaService";

const dos = (n) => String(n).padStart(2, "0");

// Formato que espera el input datetime-local ("YYYY-MM-DDTHH:mm", hora local)
const ahoraParaInput = () => {
    const f = new Date();

    return `${f.getFullYear()}-${dos(f.getMonth() + 1)}-${dos(f.getDate())}T${dos(f.getHours())}:${dos(f.getMinutes())}`;
};

function ReservaMesaForm({ mesa, onGuardada, onCancelar }) {
    const [formulario, setFormulario] = useState({
        fechaHora: "",
        cantComensales: "",
        dni: ""
    });
    const [error, setError] = useState("");

    const manejarCambio = (e) => {
        setFormulario({ ...formulario, [e.target.name]: e.target.value });
    };

    const manejarEnvio = async (e) => {
        e.preventDefault();
        setError("");

        if (!formulario.fechaHora) {
            setError("Elegí la fecha y la hora.");
            return;
        }

        const fecha = new Date(formulario.fechaHora);

        if (fecha < new Date()) {
            setError("La fecha y hora tienen que ser futuras.");
            return;
        }

        const cantidad = Number(formulario.cantComensales);

        if (!Number.isInteger(cantidad) || cantidad < 1) {
            setError("Ingresá la cantidad de comensales.");
            return;
        }
        if (cantidad > mesa.maxComensales) {
            setError(`Esta mesa admite hasta ${mesa.maxComensales} comensales.`);
            return;
        }

        try {
            await crearReserva({
                idMesa: mesa.idMesa,
                fechaHoraReservada: fecha.toISOString(),
                cantComensales: cantidad,
                estadoReserva: "Activa",
                dni: formulario.dni
            });

            onGuardada();
        } catch (e) {
            setError(e.message || "No se pudo crear la reserva.");
        }
    };

    return (
        <form onSubmit={manejarEnvio}>
            {error && <div className="alert alert-danger py-2">{error}</div>}

            <label className="form-label">Fecha y hora</label>
            <input
                type="datetime-local"
                name="fechaHora"
                className="form-control mb-2"
                min={ahoraParaInput()}
                value={formulario.fechaHora}
                onChange={manejarCambio}
            />

            <label className="form-label">Cantidad de comensales</label>
            <input
                type="number"
                min="1"
                max={mesa.maxComensales}
                name="cantComensales"
                className="form-control mb-2"
                value={formulario.cantComensales}
                onChange={manejarCambio}
            />

            <label className="form-label">DNI</label>
            <input
                type="text"
                name="dni"
                className="form-control mb-3"
                value={formulario.dni}
                onChange={manejarCambio}
            />

            <button type="submit" className="btn btn-warning w-100 mb-2">
                Confirmar reserva
            </button>
            <button type="button" className="btn btn-secondary w-100" onClick={onCancelar}>
                Cancelar
            </button>
        </form>
    );
}

export default ReservaMesaForm;