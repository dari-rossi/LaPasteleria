import { useEffect, useState } from "react";
import {
    obtenerTiposEmpleado,
    eliminarTipoEmpleado
} from "../services/tipoEmpleadoService";
import TipoEmpleadoForm from "./TipoEmpleadoForm";

// El sueldo puede llegar como número o como texto, por eso se convierte antes de formatear
const formatearPrecio = (valor) => {
    if (valor === null || valor === undefined || Number.isNaN(Number(valor))) {
        return "—";
    }
    return `$ ${Number(valor).toLocaleString("es-AR", { minimumFractionDigits: 2 })}`;
};

// Botones Editar y Eliminar: suaves por defecto, con el color fuerte al pasar el mouse
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

// Fila seleccionada: borde gris separado de la fila, igual que las mesas
const ESTILO_FILA_SELECCIONADA = {
    outline: "4px solid #757575",
    outlineOffset: "2px"
};

// Deja un margen alrededor de la tabla para que el borde de la fila seleccionada no se corte
// (el margen negativo compensa el relleno, así la tabla queda alineada igual que antes)
const ESTILO_CONTENEDOR_TABLA = {
    padding: 8,
    margin: -8
};

// asignacionesVersion: cambia cuando se modifican las asignaciones por sucursal (hay que volver a pedir la cantidad asignada)
// onTiposCambiados: avisa al padre que se creó, modificó o eliminó un tipo
function TipoEmpleadoList({ asignacionesVersion = 0, onTiposCambiados }) {
    const [tipos, setTipos] = useState([]);
    const [error, setError] = useState("");
    const [tipoEditar, setTipoEditar] = useState(null);

    // El panel para crear o editar un tipo está oculto hasta que se lo pide
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    // Fila seleccionada (id del tipo): al elegirla aparecen Editar y Eliminar
    const [tipoSeleccionado, setTipoSeleccionado] = useState(null);

    // Cada vez que cambia este número se vuelve a pedir la lista
    const [version, setVersion] = useState(0);

    useEffect(() => {
        let cancelado = false;

        const cargarTipos = async () => {
            try {
                const datos = await obtenerTiposEmpleado();

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

        // Si llegan dos recargas seguidas, la respuesta vieja no pisa a la nueva
        return () => {
            cancelado = true;
        };
    }, [version, asignacionesVersion]);

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
        setMostrarFormulario(false);
        recargar();
        avisarCambio();
    };

    const editarTipo = (tipo) => {
        setTipoEditar(tipo);
        setMostrarFormulario(true);
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

            // Si justo se estaba editando el tipo borrado, se cierra el panel
            if (tipoEditar && tipoEditar.id === tipo.id) {
                setTipoEditar(null);
                setMostrarFormulario(false);
            }

            setTipoSeleccionado(null);
            recargar();
            avisarCambio();
        } catch (error) {
            setError(error.message || "No se pudo eliminar el tipo de empleado.");
        }
    };

    const cancelarEdicion = () => {
        setTipoEditar(null);
        setMostrarFormulario(false);
    };

    // El botón abre el panel para crear un tipo, o lo cierra si ya está abierto
    const alternarFormulario = () => {
        setTipoEditar(null);
        setMostrarFormulario(!mostrarFormulario);
    };

    // Un clic selecciona la fila y otro clic sobre la misma la deselecciona
    const seleccionarTipo = (id) => {
        setTipoSeleccionado(tipoSeleccionado === id ? null : id);
    };

    // El tipo elegido solo cuenta si sigue visible con la búsqueda actual
    const tipoElegido = tipos.find((tipo) => tipo.id === tipoSeleccionado);

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-0">Tipos de empleado</h2>

                <button
                    className="btn btn-primary"
                    onClick={alternarFormulario}
                >
                    {mostrarFormulario ? "Cerrar" : "+ Crear tipo de empleado"}
                </button>
            </div>

            {mostrarFormulario && (
                <TipoEmpleadoForm
                    tipoEditar={tipoEditar}
                    onTipoGuardado={tipoGuardado}
                    onCancelarEdicion={cancelarEdicion}
                />
            )}

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {tipos.length === 0 && !error ? (
                <p>No hay tipos de empleado registrados.</p>
            ) : (
                <>
                    {/* Siempre ocupa el mismo lugar, así la tabla no se mueve al seleccionar */}
                    <div className="d-flex align-items-center mb-3">
                        <span className="flex-grow-1 text-truncate me-3">
                            {tipoElegido
                                ? `Seleccionado: ${tipoElegido.tipoEmpleado}`
                                : "Seleccioná una fila para editar o eliminar"}
                        </span>

                        <div className={`flex-shrink-0 ${tipoElegido ? "" : "invisible"}`}>
                            <button
                                className="btn btn-warning btn-sm me-2"
                                style={ESTILO_BOTON_EDITAR}
                                onClick={() => editarTipo(tipoElegido)}
                            >
                                Editar
                            </button>

                            <button
                                className="btn btn-danger btn-sm"
                                style={ESTILO_BOTON_ELIMINAR}
                                onClick={() => borrarTipo(tipoElegido)}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>

                    <div className="table-responsive" style={ESTILO_CONTENEDOR_TABLA}>
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Puesto</th>
                                    <th>Usuario</th>
                                    <th>Sueldo</th>
                                    <th title="Suma de la cantidad cargada en todas las sucursales">
                                        Cantidad asignada
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {tipos.map((tipo) => (
                                    <tr
                                        key={tipo.id}
                                        style={{
                                            cursor: "pointer",
                                            ...(tipoSeleccionado === tipo.id
                                                ? ESTILO_FILA_SELECCIONADA
                                                : {})
                                        }}
                                        onClick={() => seleccionarTipo(tipo.id)}
                                    >
                                        <td>{tipo.id}</td>
                                        <td>{tipo.tipoEmpleado}</td>
                                        <td>{tipo.usuario ?? "—"}</td>
                                        <td>{formatearPrecio(tipo.sueldo)}</td>
                                        <td>{tipo.cantidadAsignada}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}

export default TipoEmpleadoList;