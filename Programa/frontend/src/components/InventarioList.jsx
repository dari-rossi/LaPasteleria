import { useEffect, useState } from "react";
import {
    obtenerInventarios,
    eliminarInventario
} from "../services/inventarioService";
import InventarioForm from "./InventarioForm";

const INVENTARIOS_POR_PAGINA = 10;

// precioFinal puede venir en null
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
    const [inventarios, setInventarios] = useState([]);
    const [error, setError] = useState("");
    const [inventarioEditar, setInventarioEditar] = useState(null);

    // El panel para crear o editar un inventario está oculto hasta que se lo pide
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    // Fila seleccionada (id del inventario): al elegirla aparecen Editar y Eliminar
    const [inventarioSeleccionado, setInventarioSeleccionado] = useState(null);

    // Filtros: "todos" o "stock-bajo", y el id del producto (vacío = sin filtrar)
    const [filtro, setFiltro] = useState("todos");
    const [idProductoFiltro, setIdProductoFiltro] = useState("");

    // Paginación
    const [pagina, setPagina] = useState(1);

    useEffect(() => {
        cargarInventarios();
    }, []);

    const cargarInventarios = async () => {
        try {
            const datos = await obtenerInventarios();
            setInventarios(datos);
            setError("");
        } catch (error) {
            setError("No se pudo cargar el inventario.");
        }
    };

    // Se usa tanto al crear como al modificar: se vuelve a pedir la lista
    // porque el backend no devuelve sucursal ni producto en esas respuestas
    const inventarioGuardado = () => {
        cargarInventarios();
        setInventarioEditar(null);
        setMostrarFormulario(false);
    };

    const editarInventario = (inventario) => {
        setInventarioEditar(inventario);
        setMostrarFormulario(true);
    };

    const borrarInventario = async (id) => {
        const confirmar = window.confirm(
            "¿Está seguro de que desea eliminar este registro de inventario?"
        );

        if (!confirmar) {
            return;
        }

        try {
            await eliminarInventario(id);

            setInventarios(
                inventarios.filter((inventario) => inventario.id !== id)
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
        setInventarioEditar(null);
        setMostrarFormulario(!mostrarFormulario);
    };

    // Un clic selecciona la fila y otro clic sobre la misma la deselecciona
    const seleccionarInventario = (id) => {
        setInventarioSeleccionado(inventarioSeleccionado === id ? null : id);
    };

    // Al cambiar un filtro se vuelve a la primera página
    const cambiarFiltro = (e) => {
        setFiltro(e.target.value);
        setPagina(1);
    };

    const cambiarIdProductoFiltro = (e) => {
        setIdProductoFiltro(e.target.value);
        setPagina(1);
    };

    // Solo el inventario de la sucursal en la que se está trabajando
    const inventariosDeSucursal = inventarios.filter(
        (inventario) => inventario.sucursalId === Number(sucursalId)
    );

    const inventariosFiltrados = inventariosDeSucursal.filter((inventario) => {
        // Stock bajo: el stock llegó al stock mínimo del producto o está por debajo
        const coincideStock =
            filtro === "todos" ||
            inventario.stock <= inventario.producto.stockMin;

        const coincideProducto =
            idProductoFiltro === "" ||
            inventario.producto.idProducto === Number(idProductoFiltro);

        return coincideStock && coincideProducto;
    });

    // El registro elegido solo cuenta si sigue visible con los filtros actuales
    const inventarioElegido = inventariosFiltrados.find(
        (inventario) => inventario.id === inventarioSeleccionado
    );

    const totalPaginas = Math.max(
        1,
        Math.ceil(inventariosFiltrados.length / INVENTARIOS_POR_PAGINA)
    );

    // Si al borrar quedan menos páginas, no se pasa del final
    const paginaActual = Math.min(pagina, totalPaginas);

    const inicio = (paginaActual - 1) * INVENTARIOS_POR_PAGINA;
    const inventariosDePagina = inventariosFiltrados.slice(
        inicio,
        inicio + INVENTARIOS_POR_PAGINA
    );

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-0">Inventario</h2>

                <button
                    className="btn btn-primary"
                    onClick={alternarFormulario}
                >
                    {mostrarFormulario ? "Cerrar" : "+ Crear inventario"}
                </button>
            </div>

            {mostrarFormulario && (
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

            {inventariosDeSucursal.length === 0 && !error ? (
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

                    {inventariosFiltrados.length === 0 && !error ? (
                        <p>No hay productos que coincidan con los filtros.</p>
                    ) : (
                        <>
                            {}
                            <div className="d-flex align-items-center mb-3">
                                <span className="flex-grow-1 text-truncate me-3">
                                    {inventarioElegido
                                        ? `Seleccionado: ${inventarioElegido.producto.nombre}`
                                        : "Seleccioná una fila para editar o eliminar"}
                                </span>

                                <div className={`flex-shrink-0 ${inventarioElegido ? "" : "invisible"}`}>
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        style={ESTILO_BOTON_EDITAR}
                                        onClick={() => editarInventario(inventarioElegido)}
                                    >
                                        Editar
                                    </button>

                                    <button
                                        className="btn btn-danger btn-sm"
                                        style={ESTILO_BOTON_ELIMINAR}
                                        onClick={() =>
                                            borrarInventario(inventarioElegido.id)
                                        }
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
                                                    cursor: "pointer",
                                                    ...(inventario.stock < inventario.producto.stockMin
                                                        ? ESTILO_STOCK_BAJO
                                                        : {}),
                                                    ...(inventarioSeleccionado === inventario.id
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
                                                <td>{inventario.producto.stockMin}</td>
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