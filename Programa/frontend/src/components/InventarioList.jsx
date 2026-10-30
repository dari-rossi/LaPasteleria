import { useEffect, useState } from "react";
import {
    obtenerInventarios,
    eliminarInventario
} from "../services/inventarioService";
import InventarioForm from "./InventarioForm";
import { useAuth } from "../context/AuthContext";

const INVENTARIOS_POR_PAGINA = 10;

const formatearPrecio = (valor) => {
    if (valor === null || valor === undefined) {
        return "—";
    }

    return `$ ${valor.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`;
};

const ESTILO_STOCK_BAJO = {
    "--bs-table-bg": "#e57373",
    "--bs-table-color": "#000"
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

// sucursalId llega desde afuera: la sucursal se elige al iniciar el sistema,
// y esta tabla siempre muestra el inventario de esa sucursal
function InventarioList({ sucursalId }) {
    const { sesion } = useAuth();
    const rol = sesion?.rol;

    const puedeCrear = rol === "DUENIO";
    const puedeEditar = rol === "DUENIO" || rol === "AYUDANTE_COCINA";
    const puedeEliminar = rol === "DUENIO";
    const puedeSeleccionar = puedeEditar || puedeEliminar;

    const [inventarios, setInventarios] = useState([]);
    const [error, setError] = useState("");
    const [inventarioEditar, setInventarioEditar] = useState(null);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [inventarioSeleccionado, setInventarioSeleccionado] = useState(null);
    const [filtro, setFiltro] = useState("todos");
    const [idProductoFiltro, setIdProductoFiltro] = useState("");
    const [pagina, setPagina] = useState(1);
    const [version, setVersion] = useState(0);

    useEffect(() => {
        let cancelado = false;

        const cargarInventarios = async () => {
            try {
                const datos = await obtenerInventarios({
                productoId: idProductoFiltro,
                stockBajo: filtro === "stock-bajo"
                });

                if (!cancelado) {
                    setInventarios(datos);
                    setError("");
            }
        }   catch {
                if (!cancelado) {
                    setError("No se pudo cargar el inventario.");
                }
            }
    };

    cargarInventarios();


    return () => {
        cancelado = true;
    };
    }, [filtro, idProductoFiltro, sucursalId, version]);

    const recargar = () => {
        setVersion((actual) => actual + 1);
    };

    // Se usa tanto al crear como al modificar: se vuelve a pedir la lista
    // porque el backend no devuelve sucursal ni producto en esas respuestas
    const inventarioGuardado = () => {
        setInventarioEditar(null);
        setMostrarFormulario(false);
        recargar();
    };

    const editarInventario = (inventario) => {
        if (!puedeEditar) {
            return;
        }

        setInventarioEditar(inventario);
        setMostrarFormulario(true);
    };

    const borrarInventario = async (id) => {
        if (!puedeEliminar) {
            return;
        }

        const confirmar = window.confirm(
            "¿Está seguro de que desea eliminar este registro de inventario?"
        );

        if (!confirmar) {
            return;
        }

        try {
            await eliminarInventario(id);

            setInventarios((anteriores) =>
                anteriores.filter((inventario) => inventario.id !== id)
            );

            setInventarioSeleccionado(null);
        } catch (error) {
            setError("No se pudo eliminar el registro de inventario.");
        }
    };

    const cancelarEdicion = () => {
        setInventarioEditar(null);
        setMostrarFormulario(false);
    };

    // El botón abre el panel para crear un inventario, o lo cierra si ya está abierto
    const alternarFormulario = () => {
        if (!puedeCrear) {
            return;
        }

        setInventarioEditar(null);
        setMostrarFormulario(!mostrarFormulario);
    };

    // Solo los roles autorizados pueden seleccionar una fila
    const seleccionarInventario = (id) => {
        if (!puedeSeleccionar) {
            return;
        }

        setInventarioSeleccionado(
            inventarioSeleccionado === id ? null : id
        );
    };

    // Al cambiar un filtro se vuelve a la primera página
    const cambiarFiltro = (e) => {
        setFiltro(e.target.value);
        setPagina(1);
        setInventarioSeleccionado(null);
    };

    const cambiarIdProductoFiltro = (e) => {
        setIdProductoFiltro(e.target.value);
        setPagina(1);
        setInventarioSeleccionado(null);
    };

    const hayFiltros = filtro !== "todos" || idProductoFiltro !== "";


    // El registro elegido solo cuenta si sigue visible con los filtros actuales
    const inventarioElegido = inventarios.find(
        (inventario) => inventario.id === inventarioSeleccionado
    );

    const totalPaginas = Math.max(
        1,
        Math.ceil(inventarios.length / INVENTARIOS_POR_PAGINA)
    );

    // Si al borrar quedan menos páginas, no se pasa del final
    const paginaActual = Math.min(pagina, totalPaginas);

    const inicio = (paginaActual - 1) * INVENTARIOS_POR_PAGINA;
    const inventariosDePagina = inventarios.slice(
        inicio,
        inicio + INVENTARIOS_POR_PAGINA
    );

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-0">Inventario</h2>

                {puedeCrear && (
                    <button
                        className="btn btn-primary"
                        onClick={alternarFormulario}
                    >
                        {mostrarFormulario ? "Cerrar" : "+ Crear inventario"}
                    </button>
                )}
            </div>

            {puedeEditar && mostrarFormulario && (
                <InventarioForm
                    sucursalId={sucursalId}
                    inventarioEditar={inventarioEditar}
                    onInventarioGuardado={inventarioGuardado}
                    onCancelarEdicion={cancelarEdicion}
                />
            )}

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {inventarios.length === 0 && !hayFiltros && !error ? (
                <p>No hay registros de inventario.</p>
            ) : (
                <>
                    <div className="card mb-4">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Mostrar</label>
                                    <select
                                        className="form-select"
                                        value={filtro}
                                        onChange={cambiarFiltro}
                                    >
                                        <option value="todos">Todos</option>
                                        <option value="stock-bajo">Stock bajo</option>
                                    </select>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">ID del producto</label>
                                    <input
                                        type="number"
                                        step="1"
                                        min="1"
                                        className="form-control"
                                        value={idProductoFiltro}
                                        onChange={cambiarIdProductoFiltro}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {inventarios.length === 0 && !error ? (
                        <p>No hay productos que coincidan con los filtros.</p>
                    ) : (
                        <>
                            {puedeSeleccionar && (
                                <div className="d-flex align-items-center mb-3">
                                    <span className="flex-grow-1 text-truncate me-3">
                                        {inventarioElegido
                                            ? `Seleccionado: ${inventarioElegido.producto.nombre}`
                                            : puedeEliminar
                                                ? "Seleccioná una fila para editar o eliminar"
                                                : "Seleccioná una fila para editar el stock"}
                                    </span>

                                    <div className={`flex-shrink-0 ${inventarioElegido ? "" : "invisible"}`}>
                                        {puedeEditar && (
                                            <button
                                                className="btn btn-warning btn-sm me-2"
                                                style={ESTILO_BOTON_EDITAR}
                                                disabled={!inventarioElegido}
                                                onClick={() => editarInventario(inventarioElegido)}
                                            >
                                                Editar
                                            </button>
                                        )}

                                        {puedeEliminar && (
                                            <button
                                                className="btn btn-danger btn-sm"
                                                style={ESTILO_BOTON_ELIMINAR}
                                                disabled={!inventarioElegido}
                                                onClick={() => borrarInventario(inventarioElegido.id)}
                                            >
                                                Eliminar
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="table-responsive" style={ESTILO_CONTENEDOR_TABLA}>
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Nombre</th>
                                            <th>Tipo</th>
                                            <th>Precio</th>
                                            <th>Stock mínimo</th>
                                            <th>Stock</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {inventariosDePagina.map((inventario) => (
                                            <tr
                                                key={inventario.id}
                                                style={{
                                                    cursor: puedeSeleccionar ? "pointer" : "default",
                                                    ...(inventario.stock < inventario.producto.stockMinimo
                                                        ? ESTILO_STOCK_BAJO
                                                        : {}),
                                                    ...(puedeSeleccionar &&
                                                        inventarioSeleccionado === inventario.id
                                                        ? ESTILO_FILA_SELECCIONADA
                                                        : {})
                                                }}
                                                onClick={() =>
                                                    seleccionarInventario(inventario.id)
                                                }
                                            >
                                                <td>{inventario.producto.idProducto}</td>
                                                <td>{inventario.producto.nombre}</td>
                                                <td>{inventario.producto.tipoProducto}</td>
                                                <td>{formatearPrecio(inventario.producto.precio)}</td>
                                                <td>{inventario.producto.stockMinimo}</td>
                                                <td>{inventario.stock}</td>
                                            </tr>
                                        ))}
                                    </tbody>
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
                </>
            )}
        </div>
    );
}

export default InventarioList;