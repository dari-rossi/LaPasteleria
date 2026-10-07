import { useEffect, useState } from "react";
import { crearCliente, modificarCliente } from "../services/clienteService";

function ClienteForm({ clienteEditar, onClienteCreado, onClienteModificado, onCancelarEdicion }) {
    const [formulario, setFormulario] = useState({
        tipo: ""
    });

    const [error, setError] = useState("");

    useEffect(() => {
        if (clienteEditar) {
            setFormulario({
                tipo: clienteEditar.tipo
            });
        }
    }, [clienteEditar]);

    const manejarCambio = (e) => {
        console.log("VALOR SELECCIONADO:", e.target.value);
        console.log("NOMBRE DEL CAMPO:", e.target.name);

        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value
        });
    };

    const manejarEnvio = async (e) => {
        e.preventDefault();
        setError("");

        console.log("FORMULARIO:", formulario);

        try {
            if (clienteEditar) {
                const clienteModificado = await modificarCliente(
                    clienteEditar.id,
                    formulario
                );

                onClienteModificado(clienteModificado);
            } else {
                const nuevoCliente = await crearCliente(formulario);

                onClienteCreado(nuevoCliente);
            }

            setFormulario({
                tipo: ""
            });
        } catch (error) {
            console.error("ERROR:", error);

            setError(
                error.message ||
                (clienteEditar
                    ? "No se pudo modificar el cliente."
                    : "No se pudo crear el cliente.")
            );
        }
    };

    const cancelarEdicion = () => {
        setFormulario({
            tipo: ""
        });

        onCancelarEdicion();
    };

    return (
        <div className="card mb-4">
            <div className="card-body">
                <h3 className="card-title">
                    {clienteEditar ? "Editar cliente" : "Nuevo cliente"}
                </h3>

                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                <form onSubmit={manejarEnvio}>
                    <div className="mb-3">
                        <label className="form-label">Tipo de cliente</label>

                        <select
                            name="tipo"
                            className="form-select"
                            value={formulario.tipo}
                            onChange={manejarCambio}
                        >
                            <option value="">Seleccione un tipo</option>
                            <option value="Jubilado">Jubilado</option>
                            <option value="Estudiante">Estudiante</option>
                            <option value="General">General</option>
                        </select>
                    </div>

                    <button type="submit" className="btn btn-primary me-2">
                        {clienteEditar ? "Guardar cambios" : "Crear cliente"}
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