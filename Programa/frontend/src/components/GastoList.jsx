import { useEffect, useState } from "react";
import { obtenerGastos, eliminarGasto } from "../services/gastoService";
import GastoForm from "./GastoForm";

const GASTOS_POR_PAGINA = 10;

const formatearFecha = (fecha) => {
    const [anio, mes, dia] = fecha.slice(0, 10).split("-");

    return `${dia}/${mes}/${anio}`;
};

const formatearCosto = (costo) => {
    return Number(costo).toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS"
    });
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

// sucursalId llega desde afuera: la sucursal se elige al iniciar el sistema,
// y esta tabla siempre muestra los gastos de esa sucursal
function GastoList({ sucursalId }) {
    const [gastos, setGastos] = useState([]);
    const [error, setError] = useState("");
    const [gastoEditar, setGastoEditar] = useState(null);

    // El panel para crear o editar un gasto está oculto hasta que se lo pide
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    // Fila seleccionada (id del gasto): al elegirla aparecen Editar y Eliminar
    const [gastoSeleccionado, setGastoSeleccionado] = useState(null);

    // Búsqueda por nombre (opcional)
    const [filtroNombre, setFiltroNombre] = useState("");

    // Paginación
    const [pagina, setPagina] = useState(1);

    // Cada vez que cambia este número se vuelve a pedir la lista
    const [version, setVersion] = useState(0);

    useEffect(() => {
        let cancelado = false;

        const cargarGastos = async () => {
            try {
                const datos = await obtenerGastos({
                    nombre: filtroNombre.trim()
                });

                if (!cancelado) {
                    setGastos(datos);
                    setError("");
                }
            } catch {
                if (!cancelado) {
                    setError("No se pudieron cargar los gastos.");
                }
            }
        };

        cargarGastos();

        // Si se escribe rápido, la respuesta vieja no pisa a la nueva
        return () => {
            cancelado = true;
        };
    }, [filtroNombre, sucursalId, version]);

    const recargar = () => {
        setVersion((actual) => actual + 1);
    };

    // Se usa tanto al crear como al modificar: se vuelve a pedir la lista
    // para respetar el orden y los filtros que estén puestos
    const gastoGuardado = () => {
        setGastoEditar(null);
        setMostrarFormulario(false);
        recargar();
    };

    const editarGasto = (gasto) => {
        setGastoEditar(gasto);
        setMostrarFormulario(true);
    };

    const borrarGasto = async (id) => {
        const confirmar = window.confirm(
            "¿Está seguro de que desea eliminar este gasto?"
        );

        if (!confirmar) {
            return;
        }

        try {
            await eliminarGasto(id);

            // Si justo se estaba editando el gasto borrado, se cierra el panel
            if (gastoEditar && gastoEditar.id === id) {
                setGastoEditar(null);
                setMostrarFormulario(false);
            }

            setGastoSeleccionado(null);
            recargar();
        } catch (error) {
            setError(error.message || "No se pudo eliminar el gasto.");
        }
    };

    const cancelarEdicion = () => {
        setGastoEditar(null);
        setMostrarFormulario(false);
    };

    // El botón abre el panel para crear un gasto, o lo cierra si ya está abierto
    const alternarFormulario = () => {
        setGastoEditar(null);
        setMostrarFormulario(!mostrarFormulario);
    };

    // Un clic selecciona la fila y otro clic sobre la misma la deselecciona
    const seleccionarGasto = (id) => {
        setGastoSeleccionado(gastoSeleccionado === id ? null : id);
    };

    // Al cambiar la búsqueda se vuelve a la primera página
    const cambiarFiltroNombre = (e) => {
        setFiltroNombre(e.target.value);
        setPagina(1);
    };

    const gastoElegido = gastos.find((gasto) => gasto.id === gastoSeleccionado);

    const total = Math.round(
        gastos.reduce((suma, gasto) => suma + Number(gasto.costo), 0) * 100
    ) / 100;

    const hayFiltros = filtroNombre.trim() !== "";

    const totalPaginas = Math.max(
        1,
        Math.ceil(gastos.length / GASTOS_POR_PAGINA)
    );

    const paginaActual = Math.min(pagina, totalPaginas);

    const inicio = (paginaActual - 1) * GASTOS_POR_PAGINA;
    const gastosDePagina = gastos.slice(inicio, inicio + GASTOS_POR_PAGINA);

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-0">Gastos</h2>

                <button
                    className="btn btn-primary"
                    onClick={alternarFormulario}
                >
                    {mostrarFormulario ? "Cerrar" : "+ Agregar gasto"}
                </button>
            </div>

            {mostrarFormulario && (
                <GastoForm
                    sucursalId={sucursalId}
                    gastoEditar={gastoEditar}
                    onGastoGuardado={gastoGuardado}
                    onCancelarEdicion={cancelarEdicion}
                />
            )}

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {}
            <div className="card mb-4">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6">
                            <label className="form-label">Nombre</label>
                            <input
                                type="text"
                                className="form-control"
                                value={filtroNombre}
                                onChange={cambiarFiltroNombre}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {gastos.length === 0 && !error ? (
                <p>
                    {hayFiltros
                        ? "No hay gastos que coincidan con la búsqueda."
                        : "No hay gastos registrados."}
                </p>
            ) : (
                <>
                    {/* Siempre ocupa el mismo lugar, así la tabla no se mueve al seleccionar */}
                    <div className="d-flex align-items-center mb-3">
                        <span className="flex-grow-1 text-truncate me-3">
                            {gastoElegido
                                ? `Seleccionado: ${gastoElegido.nombre}`
                                : "Seleccioná una fila para editar o eliminar"}
                        </span>

                        <div className={`flex-shrink-0 ${gastoElegido ? "" : "invisible"}`}>
                            <button
                                className="btn btn-warning btn-sm me-2"
                                style={ESTILO_BOTON_EDITAR}
                                onClick={() => editarGasto(gastoElegido)}
                            >
                                Editar
                            </button>

                            <button
                                className="btn btn-danger btn-sm"
                                style={ESTILO_BOTON_ELIMINAR}
                                onClick={() => borrarGasto(gastoElegido.id)}
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
                                    <th>Nombre</th>
                                    <th>Costo</th>
                                    <th>Fecha</th>
                                </tr>
                            </thead>

                            <tbody>
                                {gastosDePagina.map((gasto) => (
                                    <tr
                                        key={gasto.id}
                                        style={{
                                            cursor: "pointer",
                                            ...(gastoSeleccionado === gasto.id
                                                ? ESTILO_FILA_SELECCIONADA
                                                : {})
                                        }}
                                        onClick={() => seleccionarGasto(gasto.id)}
                                    >
                                        <td>{gasto.id}</td>
                                        <td>{gasto.nombre}</td>
                                        <td>{formatearCosto(gasto.costo)}</td>
                                        <td>{formatearFecha(gasto.fechaGasto)}</td>
                                    </tr>
                                ))}
                            </tbody>

                            <tfoot>
                                <tr>
                                    <th colSpan="2">Total de los gastos</th>
                                    <th colSpan="2">{formatearCosto(total)}</th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                        <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => setPagina(paginaActual - 1)}
                            disabled={paginaActual === 1}
                        >
                            Anterior
                        </button>

                        <span>
                            Página {paginaActual} de {totalPaginas}
                        </span>

                        <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => setPagina(paginaActual + 1)}
                            disabled={paginaActual === totalPaginas}
                        >
                            Siguiente
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default GastoList;