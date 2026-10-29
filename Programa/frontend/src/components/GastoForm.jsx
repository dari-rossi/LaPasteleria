import { useEffect, useState } from "react";
import { crearGasto, modificarGasto } from "../services/gastoService";

const FORMULARIO_VACIO = {
    nombre: "",
    costo: "",
    fechaGasto: ""
};

// sucursalId llega desde afuera: el gasto se crea siempre para la sucursal
// en la que se está trabajando, por eso no se elige acá
function GastoForm({ sucursalId, gastoEditar, onGastoGuardado, onCancelarEdicion }) {
    const [formulario, setFormulario] = useState(FORMULARIO_VACIO);
    const [error, setError] = useState("");

    useEffect(() => {
        if (gastoEditar) {
            setFormulario({
                nombre: gastoEditar.nombre,
                costo: String(gastoEditar.costo),
                // El backend manda "2026-10-06T00:00:00.000Z": el input de fecha solo quiere AAAA-MM-DD
                fechaGasto: gastoEditar.fechaGasto.slice(0, 10)
            });
        }
    }, [gastoEditar]);

    const manejarCambio = (e) => {
        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value
        });
    };

    const manejarEnvio = async (e) => {
        e.preventDefault();
        setError("");

        // El backend espera números, pero los inputs devuelven texto
        const datos = {
            nombre: formulario.nombre.trim(),
            costo: Number(formulario.costo),
            fechaGasto: formulario.fechaGasto,
            sucursalId: Number(sucursalId)
        };

        try {
            if (gastoEditar) {
                await modificarGasto(gastoEditar.id, datos);
            } else {
                await crearGasto(datos);
            }

            setFormulario(FORMULARIO_VACIO);
            onGastoGuardado();
        } catch (error) {
            setError(
                error.message ||
                (gastoEditar
                    ? "No se pudo modificar el gasto."
                    : "No se pudo crear el gasto.")
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
                    {gastoEditar ? "Editar gasto" : "Nuevo gasto"}
                </h3>

                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                <form onSubmit={manejarEnvio}>
                    <div className="mb-3">
                        <label className="form-label">Nombre</label>
                        <input
                            type="text"
                            name="nombre"
                            className="form-control"
                            value={formulario.nombre}
                            onChange={manejarCambio}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Costo</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            name="costo"
                            className="form-control"
                            value={formulario.costo}
                            onChange={manejarCambio}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Fecha</label>
                        <input
                            type="date"
                            name="fechaGasto"
                            className="form-control"
                            value={formulario.fechaGasto}
                            onChange={manejarCambio}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary me-2">
                        {gastoEditar ? "Guardar cambios" : "Agregar gasto"}
                    </button>

                    {gastoEditar && (
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

export default GastoForm;