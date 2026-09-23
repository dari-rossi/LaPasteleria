import { useEffect, useState } from "react";
import { crearSucursal, modificarSucursal } from "../services/sucursalService";

function SucursalForm({ sucursalEditar, onSucursalCreada, onSucursalModificada, onCancelarEdicion }) {
    const [formulario, setFormulario] = useState({
        telefono: "",
        direccion: "",
        codigoPostal: "",
        horarios: ""
    });

    const [error, setError] = useState("");

    useEffect(() => {
        if (sucursalEditar) {
            setFormulario({
                telefono: sucursalEditar.telefono,
                direccion: sucursalEditar.direccion,
                codigoPostal: sucursalEditar.codigoPostal,
                horarios: sucursalEditar.horarios
            });
        }
    }, [sucursalEditar]);

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
            if (sucursalEditar) {
                const sucursalModificada = await modificarSucursal(
                    sucursalEditar.id,
                    formulario
                );

                onSucursalModificada(sucursalModificada);
            } else {
                const nuevaSucursal = await crearSucursal(formulario);

                onSucursalCreada(nuevaSucursal);
            }

            setFormulario({
                telefono: "",
                direccion: "",
                codigoPostal: "",
                horarios: ""
            });
        } catch (error) {
            setError(
                error.message ||
                (sucursalEditar
                    ? "No se pudo modificar la sucursal."
                    : "No se pudo crear la sucursal.")
            );
        }
    };

    const cancelarEdicion = () => {
        setFormulario({
            telefono: "",
            direccion: "",
            codigoPostal: "",
            horarios: ""
        });

        onCancelarEdicion();
    };

    return (
        <div className="card mb-4">
            <div className="card-body">
                <h3 className="card-title">
                    {sucursalEditar ? "Editar sucursal" : "Nueva sucursal"}
                </h3>

                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                <form onSubmit={manejarEnvio}>
                    <div className="mb-3">
                        <label className="form-label">Teléfono</label>
                        <input
                            type="text"
                            name="telefono"
                            className="form-control"
                            value={formulario.telefono}
                            onChange={manejarCambio}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Dirección</label>
                        <input
                            type="text"
                            name="direccion"
                            className="form-control"
                            value={formulario.direccion}
                            onChange={manejarCambio}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Código Postal</label>
                        <input
                            type="text"
                            name="codigoPostal"
                            className="form-control"
                            value={formulario.codigoPostal}
                            onChange={manejarCambio}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Horarios</label>
                        <input
                            type="text"
                            name="horarios"
                            className="form-control"
                            value={formulario.horarios}
                            onChange={manejarCambio}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary me-2">
                        {sucursalEditar ? "Guardar cambios" : "Crear sucursal"}
                    </button>

                    {sucursalEditar && (
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

export default SucursalForm;