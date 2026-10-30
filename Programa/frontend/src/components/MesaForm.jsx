import { useEffect, useState } from "react";
import { crearMesa, modificarMesa } from "../services/mesaService";
import { ESTADOS_MESA } from "../models/Mesa";

const FORMULARIO_VACIO = {
    estado: "Libre",
    maxComensales: "",
    fila: "",
    columna: ""
};

function MesaForm({ mesaEditar, onMesaCreada, onMesaModificada, onCancelarEdicion }) {
    const [formulario, setFormulario] = useState(FORMULARIO_VACIO);

    const [error, setError] = useState("");

    useEffect(() => {
        if (mesaEditar) {
            setFormulario({
                estado: mesaEditar.estado,
                maxComensales: String(mesaEditar.maxComensales),
                fila: String(mesaEditar.fila ?? ""),
                columna: String(mesaEditar.columna ?? "")
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

        // Los inputs devuelven texto: el backend espera números.
        // La posición solo se manda si está completa; si no, el backend asigna la primera celda libre
        const datos = {
            estado: formulario.estado,
            maxComensales: Number(formulario.maxComensales),
            ...(formulario.fila && formulario.columna
                ? { fila: Number(formulario.fila), columna: Number(formulario.columna) }
                : {})
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

                    <div className="row mb-3">
                        <div className="col">
                            <label className="form-label">Fila</label>
                            <input
                                type="number"
                                step="1"
                                min="1"
                                name="fila"
                                className="form-control"
                                placeholder="Automática"
                                value={formulario.fila}
                                onChange={manejarCambio}
                            />
                        </div>
                        <div className="col">
                            <label className="form-label">Columna</label>
                            <input
                                type="number"
                                step="1"
                                min="1"
                                name="columna"
                                className="form-control"
                                placeholder="Automática"
                                value={formulario.columna}
                                onChange={manejarCambio}
                            />
                        </div>
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