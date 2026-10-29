import { useEffect, useState } from "react";
import { crearTipoEmpleado, modificarTipoEmpleado } from "../services/tipoEmpleadoService";
import { ETIQUETA_ROL, ROLES_CREABLES } from "../config/roles";

const FORMULARIO_VACIO = {
    rol: "",
    sueldo: ""
};

function TipoEmpleadoForm({ tipoEditar, onTipoGuardado, onCancelarEdicion }) {
    const [formulario, setFormulario] = useState(FORMULARIO_VACIO);
    const [error, setError] = useState("");

    useEffect(() => {
        if (tipoEditar) {
            setFormulario({
                rol: tipoEditar.rol,
                sueldo: String(tipoEditar.sueldo)
            });
        }
    }, [tipoEditar]);

    const manejarCambio = (e) => {
        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value
        });
    };

    const manejarEnvio = async (e) => {
        e.preventDefault();
        setError("");

        // El backend espera un número, pero el input devuelve texto
        const sueldo = Number(formulario.sueldo);

        try {
            if (tipoEditar) {
                // El rol no se puede modificar: solo se manda el sueldo
                await modificarTipoEmpleado(tipoEditar.idTipoEmpleado, { sueldo });
            } else {
                await crearTipoEmpleado({ rol: formulario.rol, sueldo });
            }

            setFormulario(FORMULARIO_VACIO);
            onTipoGuardado();
        } catch (error) {
            setError(
                error.message ||
                (tipoEditar
                    ? "No se pudo modificar el tipo de empleado."
                    : "No se pudo crear el tipo de empleado.")
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
                    {tipoEditar ? "Editar tipo de empleado" : "Nuevo tipo de empleado"}
                </h3>

                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                <form onSubmit={manejarEnvio}>
                    <div className="mb-3">
                        <label className="form-label">Puesto</label>
                        <select
                            name="rol"
                            className="form-select"
                            value={formulario.rol}
                            onChange={manejarCambio}
                            disabled={Boolean(tipoEditar)}
                            required
                        >
                            <option value="">Seleccioná un puesto</option>
                            {ROLES_CREABLES.map((rol) => (
                                <option key={rol} value={rol}>
                                    {ETIQUETA_ROL[rol]}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Sueldo</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            name="sueldo"
                            className="form-control"
                            value={formulario.sueldo}
                            onChange={manejarCambio}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary me-2">
                        {tipoEditar ? "Guardar cambios" : "Crear tipo de empleado"}
                    </button>

                    {tipoEditar && (
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

export default TipoEmpleadoForm;