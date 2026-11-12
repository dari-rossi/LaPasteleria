import { useEffect, useState } from "react";
import { modificarTipoEmpleado } from "../services/tipoEmpleadoService";
import { ETIQUETA_ROL } from "../config/roles";

function TipoEmpleadoForm({ tipoEditar, onTipoGuardado, onCancelarEdicion }) {
    const [sueldo, setSueldo] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (tipoEditar) {
            setSueldo(String(tipoEditar.sueldo));
        }
    }, [tipoEditar]);

    const manejarEnvio = async (e) => {
        e.preventDefault();
        setError("");

        const sueldoNumerico = Number(sueldo);

        if (!Number.isFinite(sueldoNumerico) || sueldoNumerico <= 0) {
            setError("El sueldo debe ser un número mayor a 0.");
            return;
        }

        try {
            await modificarTipoEmpleado(
                tipoEditar.idTipoEmpleado,
                { sueldo: sueldoNumerico }
            );

            onTipoGuardado();
        } catch (error) {
            setError(error.message || "No se pudo modificar el sueldo.");
        }
    };

    return (
        <div className="card mb-4">
            <div className="card-body">
                <h3 className="card-title">Modificar sueldo</h3>

                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                <form onSubmit={manejarEnvio}>
                    <div className="mb-3">
                        <label className="form-label">Puesto</label>
                        <input
                            type="text"
                            className="form-control"
                            value={ETIQUETA_ROL[tipoEditar.rol] ?? tipoEditar.rol}
                            disabled
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Sueldo</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            className="form-control"
                            value={sueldo}
                            onChange={(e) => setSueldo(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary me-2">
                        Guardar cambios
                    </button>

                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onCancelarEdicion}
                    >
                        Cancelar
                    </button>
                </form>
            </div>
        </div>
    );
}

export default TipoEmpleadoForm;