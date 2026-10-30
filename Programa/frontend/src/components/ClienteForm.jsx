import { useEffect, useState } from "react";
import { crearCliente, modificarCliente } from "../services/clienteService";

function ClienteForm({ clienteEditar, onClienteCreado, onClienteModificado, onCancelarEdicion }) {
    const [formulario, setFormulario] = useState({
        tipo: "",
        descuento: 0
    });

    const [error, setError] = useState("");

    useEffect(() => {
        if (clienteEditar) {
            setFormulario({
                tipo: clienteEditar.tipo,
                descuento: clienteEditar.descuento
            });
        } else {
            setFormulario({
                tipo: "",
                descuento: 0
            });
        }

        setError("");
    }, [clienteEditar]);

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
            const datos = {
                tipo: formulario.tipo,
                descuento: Number(formulario.descuento)
            };

            if (clienteEditar) {
                const clienteModificado = await modificarCliente(
                    clienteEditar.id,
                    datos
                );

                onClienteModificado(clienteModificado);
            } else {
                const nuevoCliente = await crearCliente(datos);
                onClienteCreado(nuevoCliente);
            }

            setFormulario({
                tipo: "",
                descuento: 0
            });
        } catch (error) {
            setError(error.message || "No se pudo guardar la categoría.");
        }
    };

    const cancelarEdicion = () => {
        setFormulario({
            tipo: "",
            descuento: 0
        });

        setError("");
        onCancelarEdicion();
    };

    return (
        <div className="card mb-4">
            <div className="card-body">
                <h3 className="card-title">
                    {clienteEditar ? "Editar categoría" : "Nueva categoría"}
                </h3>

                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                <form onSubmit={manejarEnvio}>
                    <div className="mb-3">
                        <label className="form-label">Tipo de cliente</label>
                        <input
                            type="text"
                            name="tipo"
                            className="form-control"
                            placeholder="Ejemplo: Docente"
                            value={formulario.tipo}
                            onChange={manejarCambio}
                            maxLength="50"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Descuento (%)</label>
                        <input
                            type="number"
                            name="descuento"
                            className="form-control"
                            value={formulario.descuento}
                            onChange={manejarCambio}
                            min="0"
                            max="100"
                            step="1"
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary me-2">
                        {clienteEditar ? "Guardar cambios" : "Crear categoría"}
                    </button>

                    {clienteEditar && (
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

export default ClienteForm;