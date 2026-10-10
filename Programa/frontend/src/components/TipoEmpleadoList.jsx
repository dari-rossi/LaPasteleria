import { useEffect, useState } from "react";
import {
    obtenerTiposEmpleado,
    eliminarTipoEmpleado
} from "../services/tipoEmpleadoService";
import TipoEmpleadoForm from "./TipoEmpleadoForm";

// asignacionesVersion: cambia cuando se modifican las asignaciones por sucursal (hay que volver a pedir la cantidad asignada)
// onTiposCambiados: avisa al padre que se creó, modificó o eliminó un tipo
function TipoEmpleadoList({ asignacionesVersion = 0, onTiposCambiados }) {
    const [tipos, setTipos] = useState([]);
    const [error, setError] = useState("");
    const [tipoEditar, setTipoEditar] = useState(null);
    const [filtro, setFiltro] = useState("");

    // Cada vez que cambia este número se vuelve a pedir la lista
    const [version, setVersion] = useState(0);

    useEffect(() => {
        let cancelado = false;

        const cargarTipos = async () => {
            try {
                const datos = await obtenerTiposEmpleado(filtro.trim());

                if (!cancelado) {
                    setTipos(datos);
                    setError("");
                }
            } catch {
                if (!cancelado) {
                    setError("No se pudieron cargar los tipos de empleado.");
                }
            }
        };

        cargarTipos();

        // Si se escribe rápido, la respuesta vieja no pisa a la nueva
        return () => {
            cancelado = true;
        };
    }, [filtro, version, asignacionesVersion]);

    // Se usa al crear, modificar y eliminar: se vuelve a pedir la lista
    // porque la cantidad asignada la calcula el backend
    const recargar = () => {
        setVersion((actual) => actual + 1);
    };

    const avisarCambio = () => {
        if (onTiposCambiados) {
            onTiposCambiados();
        }
    };

    const tipoGuardado = () => {
        setTipoEditar(null);
        recargar();
        avisarCambio();
    };

    const editarTipo = (tipo) => {
        setTipoEditar(tipo);
    };

    const borrarTipo = async (tipo) => {
        const confirmar = window.confirm(
            `¿Está seguro de que desea eliminar el tipo "${tipo.tipoEmpleado}"? También se va a quitar de las sucursales donde esté asignado.`
        );

        if (!confirmar) {
            return;
        }

        try {
            await eliminarTipoEmpleado(tipo.id);

            if (tipoEditar && tipoEditar.id === tipo.id) {
                setTipoEditar(null);
            }

            recargar();
            avisarCambio();
        } catch (error) {
            setError(error.message || "No se pudo eliminar el tipo de empleado.");
        }
    };

    const cancelarEdicion = () => {
        setTipoEditar(null);
    };

    return (
        <div>
            <h2 className="mb-3">Tipos de empleado</h2>

            <TipoEmpleadoForm
                tipoEditar={tipoEditar}
                onTipoGuardado={tipoGuardado}
                onCancelarEdicion={cancelarEdicion}
            />

            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar por puesto"
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                />
            </div>

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {tipos.length === 0 && !error ? (
                <p>
                    {filtro
                        ? "No hay puestos que coincidan con la búsqueda."
                        : "No hay tipos de empleado registrados."}
                </p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Puesto</th>
                                <th>Usuario</th>
                                <th>Sueldo</th>
                                <th title="Suma de la cantidad cargada en todas las sucursales">
                                    Cantidad Asignada
                                </th>
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {tipos.map((tipo) => (
                                <tr key={tipo.id}>
                                    <td>{tipo.id}</td>
                                    <td>{tipo.tipoEmpleado}</td>
                                    <td>{tipo.usuario ?? "-"}</td>
                                    <td>{tipo.sueldo}</td>
                                    <td>{tipo.cantidadAsignada}</td>
                                    <td>
                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => editarTipo(tipo)}
                                        >
                                            Editar
                                        </button>

                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => borrarTipo(tipo)}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default TipoEmpleadoList;
