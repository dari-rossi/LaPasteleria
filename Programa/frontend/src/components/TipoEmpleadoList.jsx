import { useEffect, useState } from "react";
import {
    obtenerTiposEmpleado,
    eliminarTipoEmpleado
} from "../services/tipoEmpleadoService";
import { ETIQUETA_ROL } from "../config/roles";
import { useAuth } from "../context/AuthContext";
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
const ESTILO_CONTENEDOR_TABLA = {
    padding: 8,
    margin: -8
};

// asignacionesVersion: cambia cuando se modifican las asignaciones por sucursal
// onTiposCambiados: avisa al padre que se creó, modificó o eliminó un tipo
function TipoEmpleadoList({ asignacionesVersion = 0, onTiposCambiados }) {
    const { sesion } = useAuth();
    const puedeModificar = sesion?.rol === "DUENIO";

    const [tipos, setTipos] = useState([]);
    const [error, setError] = useState("");
    const [tipoEditar, setTipoEditar] = useState(null);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [tipoSeleccionado, setTipoSeleccionado] = useState(null);
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
            } catch (error) {
                if (!cancelado) {
                    setError(error.message);
                }
            }
        };

        cargarTipos();

        return () => {
            cancelado = true;
        };
    }, [version, asignacionesVersion]);

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
        if (!puedeModificar) {
            return;
        }

        setTipoEditar(tipo);
        setMostrarFormulario(true);
    };

    const borrarTipo = async (tipo) => {
        if (!puedeModificar) {
            return;
        }

        const confirmar = window.confirm(
            `¿Está seguro de que desea eliminar el tipo "${ETIQUETA_ROL[tipo.rol] ?? tipo.rol}"? También se va a quitar de las sucursales donde esté asignado.`
        );

        if (!confirmar) {
            return;
        }

        setError("");

        try {
            await eliminarTipoEmpleado(tipo.idTipoEmpleado);

            if (tipoEditar && tipoEditar.idTipoEmpleado === tipo.idTipoEmpleado) {
                setTipoEditar(null);
                setMostrarFormulario(false);
            }

            setTipoSeleccionado(null);
            recargar();
            avisarCambio();
        } catch (error) {
            setError(error.message);
        }
    };

    const cancelarEdicion = () => {
        setTipoEditar(null);
        setMostrarFormulario(false);
    };

    const alternarFormulario = () => {
        if (!puedeModificar) {
            return;
        }

        setTipoEditar(null);
        setMostrarFormulario(!mostrarFormulario);
    };

    const seleccionarTipo = (id) => {
        if (!puedeModificar) {
            return;
        }

        setTipoSeleccionado((actual) => actual === id ? null : id);
    };

    const tipoElegido = tipos.find(
        (tipo) => tipo.idTipoEmpleado === tipoSeleccionado
    );

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-0">Tipos de empleado</h2>

                {puedeModificar && (
                    <button
                        className="btn btn-primary"
                        onClick={alternarFormulario}
                    >
                        {mostrarFormulario ? "Cerrar" : "+ Crear tipo de empleado"}
                    </button>
                )}
            </div>

            {puedeModificar && mostrarFormulario && (
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
                    <div className="d-flex align-items-center mb-3">
                        <span className="flex-grow-1 text-truncate me-3">
                            {puedeModificar
                                ? tipoElegido
                                    ? `Seleccionado: ${ETIQUETA_ROL[tipoElegido.rol] ?? tipoElegido.rol}`
                                    : "Seleccioná una fila para editar o eliminar"
                                : ""}
                        </span>

                        {puedeModificar && (
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
                        )}
                    </div>

                    <div className="table-responsive" style={ESTILO_CONTENEDOR_TABLA}>
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Puesto</th>
                                    <th>Sueldo</th>
                                    <th title="Suma de la cantidad cargada en todas las sucursales">
                                        Cantidad asignada
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {tipos.map((tipo) => (
                                    <tr
                                        key={tipo.idTipoEmpleado}
                                        style={{
                                            cursor: puedeModificar ? "pointer" : "default",
                                            ...(puedeModificar &&
                                                tipoSeleccionado === tipo.idTipoEmpleado
                                                ? ESTILO_FILA_SELECCIONADA
                                                : {})
                                        }}
                                        onClick={() => seleccionarTipo(tipo.idTipoEmpleado)}
                                    >
                                        <td>{tipo.idTipoEmpleado}</td>
                                        <td>{ETIQUETA_ROL[tipo.rol] ?? tipo.rol}</td>
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