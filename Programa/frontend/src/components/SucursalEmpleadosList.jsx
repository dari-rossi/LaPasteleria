import { useEffect, useState } from "react";
import {
    obtenerTiposDeSucursal,
    quitarTipoEmpleado
} from "../services/sucursalTipoEmpleadoService";
import { ETIQUETA_ROL } from "../config/roles";
import SucursalEmpleadosForm from "./SucursalEmpleadosForm";
import { useAuth } from "../context/AuthContext";

const formatearPrecio = (valor) => {
    if (valor === null || valor === undefined || Number.isNaN(Number(valor))) {
        return "—";
    }
    return `$ ${Number(valor).toLocaleString("es-AR", { minimumFractionDigits: 2 })}`;
};

const ESTILO_BOTON_EDITAR = {
    "--bs-btn-bg": "#fff3cd",
    "--bs-btn-border-color": "#ffe69c",
    "--bs-btn-color": "#664d03",
    "--bs-btn-hover-bg": "#ffc107",
    "--bs-btn-hover-border-color": "#ffc107",
    "--bs-btn-hover-color": "#000"
};

const ESTILO_BOTON_ELIMINAR = {
    "--bs-btn-bg": "#f8d7da",
    "--bs-btn-border-color": "#f1aeb5",
    "--bs-btn-color": "#58151c",
    "--bs-btn-hover-bg": "#dc3545",
    "--bs-btn-hover-border-color": "#dc3545",
    "--bs-btn-hover-color": "#fff"
};

const ESTILO_FILA_SELECCIONADA = {
    outline: "4px solid #757575",
    outlineOffset: "2px"
};

const ESTILO_CONTENEDOR_TABLA = {
    padding: 8,
    margin: -8
};

// sucursalId llega desde afuera: se muestran los empleados de esa sucursal
// (la relación SucursalTipoEmpleado: cuántos empleados de cada tipo hay ahí)
function SucursalEmpleadosList({ sucursalId }) {
    const [asignaciones, setAsignaciones] = useState([]);
    const [error, setError] = useState("");
    const [asignacionEditar, setAsignacionEditar] = useState(null);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    // Fila seleccionada (tipoEmpleadoId): al elegirla aparecen Editar y Quitar
    const [seleccionado, setSeleccionado] = useState(null);

    // Cada vez que cambia este número se vuelve a pedir la lista
    const [version, setVersion] = useState(0);
    
    const { sesion } = useAuth();

    const puedeQuitar = sesion?.rol === "DUENIO";

    useEffect(() => {
        let cancelado = false;

        const cargar = async () => {
            try {
                const datos = await obtenerTiposDeSucursal(sucursalId);

                if (!cancelado) {
                    setAsignaciones(datos);
                    setError("");
                }
            } catch (error) {
                if (!cancelado) {
                    setError(error.message);
                }
            }
        };

        cargar();

        return () => {
            cancelado = true;
        };
    }, [sucursalId, version]);

    // Si cambia la sucursal, se limpia lo que había abierto
    useEffect(() => {
        setSeleccionado(null);
        setAsignacionEditar(null);
        setMostrarFormulario(false);
    }, [sucursalId]);

    const recargar = () => {
        setVersion((actual) => actual + 1);
    };

    const asignacionGuardada = () => {
        setAsignacionEditar(null);
        setMostrarFormulario(false);
        recargar();
    };

    const editarAsignacion = (asignacion) => {
        setAsignacionEditar(asignacion);
        setMostrarFormulario(true);
    };

    const cancelarEdicion = () => {
        setAsignacionEditar(null);
        setMostrarFormulario(false);
    };

    const alternarFormulario = () => {
        setAsignacionEditar(null);
        setMostrarFormulario(!mostrarFormulario);
    };

    const seleccionar = (id) => {
        setSeleccionado(seleccionado === id ? null : id);
    };

    const quitarAsignacion = async (asignacion) => {
        const nombre = ETIQUETA_ROL[asignacion.tipoEmpleado.rol] ?? asignacion.tipoEmpleado.rol;

        const confirmar = window.confirm(
            `¿Está seguro de que desea quitar "${nombre}" de esta sucursal?`
        );

        if (!confirmar) {
            return;
        }

        setError("");

        try {
            await quitarTipoEmpleado(sucursalId, asignacion.tipoEmpleadoId);

            if (asignacionEditar &&
                asignacionEditar.tipoEmpleadoId === asignacion.tipoEmpleadoId) {
                cancelarEdicion();
            }

            setSeleccionado(null);
            recargar();
        } catch (error) {
            setError(error.message);
        }
    };

    const ordenadas = [...asignaciones].sort(
        (a, b) => a.tipoEmpleadoId - b.tipoEmpleadoId
    );

    const elegida = ordenadas.find(
        (asignacion) => asignacion.tipoEmpleadoId === seleccionado
    );

    const totalEmpleados = ordenadas.reduce(
        (total, asignacion) => total + asignacion.cantidad, 0
    );

    const totalCosto = ordenadas.reduce(
        (total, asignacion) =>
            total + asignacion.cantidad * asignacion.tipoEmpleado.sueldo, 0
    );

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-0">Empleados de la sucursal</h2>

                <button
                    className="btn btn-primary"
                    onClick={alternarFormulario}
                >
                    {mostrarFormulario ? "Cerrar" : "+ Asignar tipo de empleado"}
                </button>
            </div>

            {mostrarFormulario && (
                <SucursalEmpleadosForm
                    sucursalId={sucursalId}
                    asignaciones={asignaciones}
                    asignacionEditar={asignacionEditar}
                    onGuardado={asignacionGuardada}
                    onCancelar={cancelarEdicion}
                />
            )}

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {ordenadas.length === 0 && !error ? (
                <p>Esta sucursal todavía no tiene empleados asignados.</p>
            ) : (
                <>
                    <div className="d-flex align-items-center mb-3">
                        <span className="flex-grow-1 text-truncate me-3">
                            {elegida
                                ? `Seleccionado: ${ETIQUETA_ROL[elegida.tipoEmpleado.rol] ?? elegida.tipoEmpleado.rol}`
                                : puedeQuitar
                                    ? "Seleccioná una fila para editar la cantidad o quitarla"
                                    : "Seleccioná una fila para editar la cantidad"}
                        </span>

                        <div className={`flex-shrink-0 ${elegida ? "" : "invisible"}`}>
                            <button
                                className="btn btn-warning btn-sm me-2"
                                style={ESTILO_BOTON_EDITAR}
                                onClick={() => editarAsignacion(elegida)}
                            >
                                Editar
                            </button>

                            {puedeQuitar && (
                                <button
                                    className="btn btn-danger btn-sm"
                                    style={ESTILO_BOTON_ELIMINAR}
                                    onClick={() => quitarAsignacion(elegida)}
                                >
                                    Quitar
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="table-responsive" style={ESTILO_CONTENEDOR_TABLA}>
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Puesto</th>
                                    <th>Sueldo</th>
                                    <th>Cantidad</th>
                                    <th>Costo mensual</th>
                                </tr>
                            </thead>

                            <tbody>
                                {ordenadas.map((asignacion) => (
                                    <tr
                                        key={asignacion.tipoEmpleadoId}
                                        style={{
                                            cursor: "pointer",
                                            ...(seleccionado === asignacion.tipoEmpleadoId
                                                ? ESTILO_FILA_SELECCIONADA
                                                : {})
                                        }}
                                        onClick={() => seleccionar(asignacion.tipoEmpleadoId)}
                                    >
                                        <td>
                                            {ETIQUETA_ROL[asignacion.tipoEmpleado.rol] ?? asignacion.tipoEmpleado.rol}
                                        </td>
                                        <td>{formatearPrecio(asignacion.tipoEmpleado.sueldo)}</td>
                                        <td>{asignacion.cantidad}</td>
                                        <td>
                                            {formatearPrecio(
                                                asignacion.cantidad * asignacion.tipoEmpleado.sueldo
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                            <tfoot>
                                <tr className="fw-semibold">
                                    <td colSpan={2}>Total</td>
                                    <td>{totalEmpleados}</td>
                                    <td>{formatearPrecio(totalCosto)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}

export default SucursalEmpleadosList;