import { useEffect, useState } from "react";
import { obtenerTiposEmpleado } from "../services/tipoEmpleadoService";
import {
    asignarTipoEmpleado,
    modificarCantidad
} from "../services/sucursalTipoEmpleadoService";

const FORMULARIO_VACIO = {
    tipoEmpleadoId: "",
    cantidad: ""
};

// El padre le pone key={sucursalId}: al cambiar de sucursal el formulario se reinicia solo
function SucursalTipoEmpleadoForm({
    sucursalId,
    asignaciones,
    asignacionEditar,
    onAsignacionGuardada,
    onCancelarEdicion
}) {
    const [formulario, setFormulario] = useState(FORMULARIO_VACIO);
    const [tipos, setTipos] = useState([]);
    const [error, setError] = useState("");

    // Cada vez que cambia este número se vuelve a pedir la lista de tipos de empleado
    const [recarga, setRecarga] = useState(0);

    useEffect(() => {
        let cancelado = false;

        const cargarTipos = async () => {
            try {
                const datos = await obtenerTiposEmpleado();

                if (!cancelado) {
                    setTipos(datos);
                }
            } catch {
                if (!cancelado) {
                    setError("No se pudieron cargar los tipos de empleado.");
                }
            }
        };

        cargarTipos();

        return () => {
            cancelado = true;
        };
    }, [recarga]);

    useEffect(() => {
        if (asignacionEditar) {
            setFormulario({
                tipoEmpleadoId: String(asignacionEditar.tipoEmpleadoId),
                cantidad: String(asignacionEditar.cantidad)
            });
        }
    }, [asignacionEditar]);

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
            if (asignacionEditar) {
                // Al modificar solo cambia la cantidad
                await modificarCantidad(
                    sucursalId,
                    asignacionEditar.tipoEmpleadoId,
                    Number(formulario.cantidad)
                );
            } else {
                // El backend espera números, pero los inputs devuelven texto
                await asignarTipoEmpleado(sucursalId, {
                    tipoEmpleadoId: Number(formulario.tipoEmpleadoId),
                    cantidad: Number(formulario.cantidad)
                });
            }

            setFormulario(FORMULARIO_VACIO);
            onAsignacionGuardada();
        } catch (error) {
            setError(
                error.message ||
                (asignacionEditar
                    ? "No se pudo modificar la cantidad."
                    : "No se pudo asignar el tipo de empleado.")
            );
        }
    };

    const cancelarEdicion = () => {
        setFormulario(FORMULARIO_VACIO);
        setError("");

        onCancelarEdicion();
    };

    // Un tipo ya asignado a la sucursal no se ofrece de nuevo: ahí se modifica su cantidad
    const tiposDisponibles = tipos.filter(
        (tipo) => !asignaciones.some((asignacion) => asignacion.tipoEmpleadoId === tipo.id)
    );

    const opciones = asignacionEditar ? tipos : tiposDisponibles;

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

                <form onSubmit={manejarEnvio}>
                    <div className="mb-3">
                        <label className="form-label">Tipo de empleado</label>
                        <select
                            name="tipoEmpleadoId"
                            className="form-select"
                            value={formulario.tipoEmpleadoId}
                            onChange={manejarCambio}
                            // Al abrir el selector se actualiza la lista: así aparecen los tipos creados recién
                            onFocus={() => setRecarga((actual) => actual + 1)}
                            disabled={Boolean(asignacionEditar)}
                            required
                        >
                            <option value="">Seleccioná un tipo de empleado</option>
                            {opciones.map((tipo) => (
                                <option key={tipo.id} value={tipo.id}>
                                    {tipo.tipoEmpleado}
                                </option>
                            ))}
                        </select>

                        {!asignacionEditar && tipos.length > 0 && opciones.length === 0 && (
                            <div className="form-text">
                                Todos los tipos de empleado ya están asignados a esta sucursal.
                            </div>
                        )}
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
                        {asignacionEditar ? "Guardar cantidad" : "Asignar a la sucursal"}
                    </button>

                    {asignacionEditar && (
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

export default SucursalTipoEmpleadoForm;
