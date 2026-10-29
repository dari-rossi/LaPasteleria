import { useEffect, useState } from "react";
import { obtenerSucursales } from "../services/sucursalService";
import {
    obtenerTiposDeSucursal,
    quitarTipoEmpleado
} from "../services/sucursalTipoEmpleadoService";
import SucursalTipoEmpleadoForm from "./SucursalTipoEmpleadoForm";

// tiposVersion: cambia cuando se crea, modifica o elimina un tipo de empleado (hay que volver a pedir la lista)
// onAsignacionesCambiadas: avisa al padre que cambió una asignación (la cantidad asignada de los tipos cambia)
function SucursalTipoEmpleadoList({ tiposVersion = 0, onAsignacionesCambiadas }) {
    const [sucursales, setSucursales] = useState([]);
    const [sucursalId, setSucursalId] = useState("");
    const [asignaciones, setAsignaciones] = useState([]);
    const [asignacionEditar, setAsignacionEditar] = useState(null);
    const [error, setError] = useState("");

    // Cada vez que cambia este número se vuelve a pedir la lista de la sucursal
    const [version, setVersion] = useState(0);

    useEffect(() => {
        let cancelado = false;

        const cargarSucursales = async () => {
            try {
                const datos = await obtenerSucursales();

                if (!cancelado) {
                    setSucursales(datos);
                }
            } catch {
                if (!cancelado) {
                    setError("No se pudieron cargar las sucursales.");
                }
            }
        };

        cargarSucursales();

        return () => {
            cancelado = true;
        };
    }, []);

    useEffect(() => {
        if (!sucursalId) {
            return;
        }

        let cancelado = false;

        const cargarAsignaciones = async () => {
            try {
                const datos = await obtenerTiposDeSucursal(sucursalId);

                if (!cancelado) {
                    setAsignaciones(datos);
                    setError("");
                }
            } catch (error) {
                if (!cancelado) {
                    setError(error.message || "No se pudieron cargar los tipos de empleado de la sucursal.");
                }
            }
        };

        cargarAsignaciones();

        return () => {
            cancelado = true;
        };
    }, [sucursalId, version, tiposVersion]);

    const cambiarSucursal = (e) => {
        setSucursalId(e.target.value);
        setAsignaciones([]);
        setAsignacionEditar(null);
        setError("");
    };

    const avisarCambio = () => {
        if (onAsignacionesCambiadas) {
            onAsignacionesCambiadas();
        }
    };

    const asignacionGuardada = () => {
        setAsignacionEditar(null);
        setVersion((actual) => actual + 1);
        avisarCambio();
    };

    const editarAsignacion = (asignacion) => {
        setAsignacionEditar(asignacion);
    };

    const quitarAsignacion = async (asignacion) => {
        const confirmar = window.confirm(
            `¿Está seguro de que desea quitar "${asignacion.tipoEmpleado.tipoEmpleado}" de esta sucursal?`
        );

        if (!confirmar) {
            return;
        }

        try {
            await quitarTipoEmpleado(Number(sucursalId), asignacion.tipoEmpleadoId);

            if (asignacionEditar && asignacionEditar.tipoEmpleadoId === asignacion.tipoEmpleadoId) {
                setAsignacionEditar(null);
            }

            setVersion((actual) => actual + 1);
            avisarCambio();
        } catch (error) {
            setError(error.message || "No se pudo quitar el tipo de empleado de la sucursal.");
        }
    };

    const cancelarEdicion = () => {
        setAsignacionEditar(null);
    };

    return (
        <div>
            <h2 className="mb-3">Tipos de empleado por sucursal</h2>

            <div className="mb-4">
                <label className="form-label">Sucursal</label>
                <select
                    className="form-select"
                    value={sucursalId}
                    onChange={cambiarSucursal}
                >
                    <option value="">Seleccioná una sucursal</option>
                    {sucursales.map((sucursal) => (
                        <option key={sucursal.id} value={sucursal.id}>
                            {sucursal.id} - {sucursal.direccion}
                        </option>
                    ))}
                </select>
            </div>

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {sucursalId && (
                <>
                    <SucursalTipoEmpleadoForm
                        key={sucursalId}
                        sucursalId={Number(sucursalId)}
                        asignaciones={asignaciones}
                        asignacionEditar={asignacionEditar}
                        onAsignacionGuardada={asignacionGuardada}
                        onCancelarEdicion={cancelarEdicion}
                    />

                    {asignaciones.length === 0 && !error ? (
                        <p>Esta sucursal todavía no tiene tipos de empleado asignados.</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-striped table-bordered">
                                <thead>
                                    <tr>
                                        <th>Puesto</th>
                                        <th>Sueldo</th>
                                        <th>Cantidad</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {asignaciones.map((asignacion) => (
                                        <tr key={asignacion.tipoEmpleadoId}>
                                            <td>{asignacion.tipoEmpleado.tipoEmpleado}</td>
                                            <td>{asignacion.tipoEmpleado.sueldo}</td>
                                            <td>{asignacion.cantidad}</td>
                                            <td>
                                                <button
                                                    className="btn btn-warning btn-sm me-2"
                                                    onClick={() => editarAsignacion(asignacion)}
                                                >
                                                    Editar cantidad
                                                </button>

                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => quitarAsignacion(asignacion)}
                                                >
                                                    Quitar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default SucursalTipoEmpleadoList;
