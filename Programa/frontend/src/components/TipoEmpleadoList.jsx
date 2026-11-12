import { useEffect, useState } from "react";
import { obtenerTiposEmpleado } from "../services/tipoEmpleadoService";
import { ETIQUETA_ROL } from "../config/roles";
import { useAuth } from "../context/AuthContext";
import TipoEmpleadoForm from "./TipoEmpleadoForm";

const formatearPrecio = (valor) => {
    if (valor === null || valor === undefined || Number.isNaN(Number(valor))) {
        return "—";
    }

    return `$ ${Number(valor).toLocaleString("es-AR", {
        minimumFractionDigits: 2
    })}`;
};

const ESTILO_BOTON_EDITAR = {
    "--bs-btn-bg": "#fff3cd",
    "--bs-btn-border-color": "#ffe69c",
    "--bs-btn-color": "#664d03",
    "--bs-btn-hover-bg": "#ffc107",
    "--bs-btn-hover-border-color": "#ffc107",
    "--bs-btn-hover-color": "#000"
};

const ESTILO_FILA_SELECCIONADA = {
    outline: "4px solid #757575",
    outlineOffset: "2px"
};

const ESTILO_CONTENEDOR_TABLA = {
    padding: 8,
    margin: -8
};

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

    const tipoGuardado = () => {
        setTipoEditar(null);
        setMostrarFormulario(false);
        setTipoSeleccionado(null);
        recargar();

        if (onTiposCambiados) {
            onTiposCambiados();
        }
    };

    const editarTipo = (tipo) => {
        if (!puedeModificar) {
            return;
        }

        setTipoEditar(tipo);
        setMostrarFormulario(true);
    };

    const cancelarEdicion = () => {
        setTipoEditar(null);
        setMostrarFormulario(false);
    };

    const seleccionarTipo = (id) => {
        if (!puedeModificar) {
            return;
        }

        setTipoSeleccionado((actual) =>
            actual === id ? null : id
        );
    };

    const tipoElegido = tipos.find(
        (tipo) => Number(tipo.idTipoEmpleado) === Number(tipoSeleccionado)
    );

    return (
        <div>
            <h2 className="mb-3">Tipos de empleado</h2>

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
                                    : "Seleccioná una fila para modificar el sueldo"
                                : ""}
                        </span>

                        {puedeModificar && (
                            <div className={`flex-shrink-0 ${tipoElegido ? "" : "invisible"}`}>
                                <button
                                    className="btn btn-warning btn-sm"
                                    style={ESTILO_BOTON_EDITAR}
                                    onClick={() => editarTipo(tipoElegido)}
                                >
                                    Editar sueldo
                                </button>
                            </div>
                        )}
                    </div>

                    <div
                        className="table-responsive"
                        style={ESTILO_CONTENEDOR_TABLA}
                    >
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
                                                Number(tipoSeleccionado) === Number(tipo.idTipoEmpleado)
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