import { useEffect, useState } from "react";
import { obtenerTiposEmpleado } from "../services/tipoEmpleadoService";
import {
    asignarTipoEmpleado,
    modificarCantidad
} from "../services/sucursalTipoEmpleadoService";
import { ETIQUETA_ROL } from "../config/roles";

const FORMULARIO_VACIO = {
    tipoEmpleadoId: "",
    cantidad: ""
};

// Asigna un tipo de empleado a la sucursal con su cantidad,
// o (al editar) solo cambia la cantidad
function SucursalEmpleadosForm({
    sucursalId,
    asignaciones,
    asignacionEditar,
    onGuardado,
    onCancelar
}) {
    const [formulario, setFormulario] = useState(FORMULARIO_VACIO);
    const [tipos, setTipos] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const cargarTipos = async () => {
            try {
                setTipos(await obtenerTiposEmpleado());
            } catch (error) {
                setError(error.message);
            }
        };

        cargarTipos();
    }, []);

    useEffect(() => {
        if (asignacionEditar) {
            setFormulario({
                tipoEmpleadoId: String(asignacionEditar.tipoEmpleadoId),
                cantidad: String(asignacionEditar.cantidad)
            });
        } else {
            setFormulario(FORMULARIO_VACIO);
        }
    }, [asignacionEditar]);

    // Al crear solo se ofrecen los tipos que todavía no están en la sucursal
    const tiposDisponibles = tipos.filter(
        (tipo) => !asignaciones.some(
            (asignacion) => asignacion.tipoEmpleadoId === tipo.idTipoEmpleado
        )
    );

    const opciones = asignacionEditar ? tipos : tiposDisponibles;

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
        const cantidad = Number(formulario.cantidad);

        try {
            if (asignacionEditar) {
                await modificarCantidad(
                    sucursalId,
                    asignacionEditar.tipoEmpleadoId,
                    cantidad
                );
            } else {
                await asignarTipoEmpleado(sucursalId, {
                    tipoEmpleadoId: Number(formulario.tipoEmpleadoId),
                    cantidad
                });
            }

            setFormulario(FORMULARIO_VACIO);
            onGuardado();
        } catch (error) {
            setError(
                error.message ||
                (asignacionEditar
                    ? "No se pudo modificar la cantidad."
                    : "No se pudo asignar el tipo de empleado.")
            );
        }
    };

    const cancelar = () => {
        setFormulario(FORMULARIO_VACIO);
        setError("");

        onCancelar();
    };

    const sinTiposParaAsignar = !asignacionEditar &&
        tipos.length > 0 &&
        tiposDisponibles.length === 0;

    return (
        <div className="card mb-4">
            <div className="card-body">
                <h3 className="card-title">
                    {asignacionEditar ? "Editar cantidad" : "Asignar tipo de empleado"}
                </h3>

                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                {sinTiposParaAsignar && (
                    <div className="alert alert-info">
                        Ya están asignados todos los tipos de empleado a esta sucursal.
                    </div>
                )}

                <form onSubmit={manejarEnvio}>
                    <div className="mb-3">
                        <label className="form-label">Puesto</label>
                        <select
                            name="tipoEmpleadoId"
                            className="form-select"
                            value={formulario.tipoEmpleadoId}
                            onChange={manejarCambio}
                            disabled={Boolean(asignacionEditar)}
                            required
                        >
                            <option value="">Seleccioná un puesto</option>
                            {opciones.map((tipo) => (
                                <option key={tipo.idTipoEmpleado} value={tipo.idTipoEmpleado}>
                                    {ETIQUETA_ROL[tipo.rol] ?? tipo.rol}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Cantidad de empleados</label>
                        <input
                            type="number"
                            step="1"
                            min="1"
                            name="cantidad"
                            className="form-control"
                            value={formulario.cantidad}
                            onChange={manejarCambio}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary me-2">
                        {asignacionEditar ? "Guardar cambios" : "Asignar"}
                    </button>

                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={cancelar}
                    >
                        Cancelar
                    </button>
                </form>
            </div>
        </div>
    );
}

export default SucursalEmpleadosForm;