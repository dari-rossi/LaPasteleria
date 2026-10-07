import { useEffect, useState } from "react";
import { crearMesa, modificarMesa } from "../services/mesaService";
import { ESTADOS_MESA } from "../models/Mesa";

const FORMULARIO_VACIO = {
    estado: "Libre",
    maxComensales: ""
};

function MesaForm({ mesaEditar, onMesaCreada, onMesaModificada, onCancelarEdicion }) {
    const [formulario, setFormulario] = useState(FORMULARIO_VACIO);

    const [error, setError] = useState("");

    useEffect(() => {
        if (mesaEditar) {
            setFormulario({
                estado: mesaEditar.estado,
                maxComensales: String(mesaEditar.maxComensales)
            });
        }
    }, [mesaEditar]);

    const manejarCambio = (e) => {
        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value
        });
    };

    const manejarEnvio = async (e) => {
        e.preventDefault();
        setError("");

        // El input devuelve texto, pero el backend espera que maxComensales sea un número
        const datos = {
            ...formulario,
            maxComensales: Number(formulario.maxComensales)
        };

        try {
            if (mesaEditar) {
                const mesaModificada = await modificarMesa(
                    mesaEditar.idMesa,
                    datos
                );

                onMesaModificada(mesaModificada);
            } else {
                const nuevaMesa = await crearMesa(datos);

                onMesaCreada(nuevaMesa);
            }

            setFormulario(FORMULARIO_VACIO);
        } catch (error) {
            setError(
                error.message ||
                (mesaEditar
                    ? "No se pudo modificar la mesa."
                    : "No se pudo crear la mesa.")
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
                    {mesaEditar ? "Editar mesa" : "Nueva mesa"}
                </h3>

                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                <form onSubmit={manejarEnvio}>
                    <div className="mb-3">
                        <label className="form-label">Estado</label>
                        <select
                            name="estado"
                            className="form-select"
                            value={formulario.estado}
                            onChange={manejarCambio}
                        >
                            {ESTADOS_MESA.map((estado) => (
                                <option key={estado} value={estado}>
                                    {estado}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Máximo de comensales</label>
                        <input
                            type="number"
                            step="1"
                            min="1"
                            name="maxComensales"
                            className="form-control"
                            value={formulario.maxComensales}
                            onChange={manejarCambio}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary me-2">
                        {mesaEditar ? "Guardar cambios" : "Crear mesa"}
                    </button>

                    {mesaEditar && (
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

export default MesaForm;